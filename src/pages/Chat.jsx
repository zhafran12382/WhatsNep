import { useEffect } from 'react'
import MainLayout from '../components/Layout/MainLayout'
import ChatWindow from '../components/Chat/ChatWindow'
import { useChat } from '../hooks/useChat'
import { requestNotificationPermission } from '../utils/helpers'

/**
 * Chat dashboard page
 */
const Chat = () => {
  const { conversations, activeConversation } = useChat()

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  const activeConversationData = conversations.find(
    (conv) => conv.id === activeConversation
  )

  return (
    <MainLayout>
      <ChatWindow conversation={activeConversationData} />
    </MainLayout>
  )
}

export default Chat
