import { createContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { showNotification } from '../utils/helpers'

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [typingUsers, setTypingUsers] = useState({})

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)

      // Get conversations where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id)

      if (participantError) throw participantError

      const conversationIds = participantData.map(p => p.conversation_id)

      if (conversationIds.length === 0) {
        setConversations([])
        return
      }

      // Get conversation details with last message
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (
            id,
            content,
            created_at,
            sender_id,
            is_read
          )
        `)
        .in('id', conversationIds)
        .order('created_at', { ascending: false })

      if (conversationsError) throw conversationsError

      // Get other participants for each conversation
      const conversationsWithParticipants = await Promise.all(
        conversationsData.map(async (conv) => {
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select(`
              user_id,
              profiles (
                id,
                username,
                avatar_url,
                status,
                last_seen
              )
            `)
            .eq('conversation_id', conv.id)
            .neq('user_id', user.id)

          // Get last message
          const lastMessage = conv.messages?.[conv.messages.length - 1]

          return {
            ...conv,
            otherUser: participants[0]?.profiles,
            lastMessage,
            unreadCount: conv.messages?.filter(
              m => !m.is_read && m.sender_id !== user.id
            ).length || 0,
          }
        })
      )

      setConversations(conversationsWithParticipants)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages(data || [])

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }, [user])

  // Send a message
  const sendMessage = useCallback(async (conversationId, content) => {
    if (!conversationId || !content.trim()) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim(),
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }, [user])

  // Create or get conversation
  const getOrCreateConversation = useCallback(async (otherUserId) => {
    if (!user || !otherUserId) return null

    try {
      // Check if conversation already exists
      const { data: existingParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id)

      if (existingParticipants && existingParticipants.length > 0) {
        for (const participant of existingParticipants) {
          const { data: otherParticipants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', participant.conversation_id)
            .eq('user_id', otherUserId)

          if (otherParticipants && otherParticipants.length > 0) {
            // Conversation exists
            return participant.conversation_id
          }
        }
      }

      // Create new conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert([{ created_at: new Date().toISOString() }])
        .select()
        .single()

      if (conversationError) throw conversationError

      // Add participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: newConversation.id, user_id: user.id },
          { conversation_id: newConversation.id, user_id: otherUserId },
        ])

      if (participantsError) throw participantsError

      await fetchConversations()
      return newConversation.id
    } catch (error) {
      console.error('Error creating conversation:', error)
      return null
    }
  }, [user, fetchConversations])

  // Subscribe to new messages
  useEffect(() => {
    if (!activeConversation) return

    const channel = supabase
      .channel(`conversation:${activeConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversation}`,
        },
        async (payload) => {
          // Fetch sender profile
          const { data: sender } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.sender_id)
            .single()

          const newMessage = {
            ...payload.new,
            sender,
          }

          setMessages(prev => [...prev, newMessage])

          // Show notification if message is from another user
          if (payload.new.sender_id !== user.id) {
            showNotification('Pesan Baru', {
              body: `${sender.username}: ${payload.new.content}`,
            })

            // Mark as read
            await supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', payload.new.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeConversation, user])

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user, fetchConversations])

  const value = {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    loading,
    typingUsers,
    setTypingUsers,
    fetchConversations,
    fetchMessages,
    sendMessage,
    getOrCreateConversation,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
