import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'
import Avatar from '../UI/Avatar'
import { useChat } from '../../hooks/useChat'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { SkeletonMessage } from '../UI/Loader'

/**
 * Chat window component
 */
const ChatWindow = ({ conversation }) => {
  const { messages, sendMessage, typingUsers } = useChat()
  const onlineUsers = useOnlineStatus()
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="glass-effect rounded-full p-8 mb-4">
          <svg className="w-24 h-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-300 mb-2">
          Selamat Datang di WhatsNep
        </h2>
        <p className="text-gray-500">
          Pilih percakapan atau cari pengguna untuk mulai chat
        </p>
      </div>
    )
  }

  const isOnline = onlineUsers.has(conversation.otherUser?.id)
  const isTyping = typingUsers[conversation.otherUser?.id]

  const handleSendMessage = async (content) => {
    try {
      await sendMessage(conversation.id, content)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 border-b border-gray-700 bg-dark-200"
      >
        <Avatar
          username={conversation.otherUser?.username}
          src={conversation.otherUser?.avatar_url}
          online={isOnline}
          size="lg"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-gray-100">
            {conversation.otherUser?.username}
          </h2>
          <p className="text-sm text-gray-400">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </motion.div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-400">Belum ada pesan</p>
            <p className="text-sm text-gray-500 mt-2">
              Kirim pesan untuk memulai percakapan
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator username={conversation.otherUser?.username} />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  )
}

export default ChatWindow
