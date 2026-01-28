import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import ChatList from '../Chat/ChatList'
import UserSearch from '../Chat/UserSearch'
import { useChat } from '../../hooks/useChat'
import Button from '../UI/Button'
import { SkeletonChatItem } from '../UI/Loader'

/**
 * Sidebar component
 */
const Sidebar = () => {
  const { conversations, loading, setActiveConversation, getOrCreateConversation, fetchMessages } = useChat()
  const [showUserSearch, setShowUserSearch] = useState(false)

  const handleSelectConversation = async (conversationId) => {
    setActiveConversation(conversationId)
    await fetchMessages(conversationId)
  }

  const handleSelectUser = async (user) => {
    const conversationId = await getOrCreateConversation(user.id)
    if (conversationId) {
      setActiveConversation(conversationId)
      await fetchMessages(conversationId)
    }
    setShowUserSearch(false)
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full md:w-80 lg:w-96 bg-dark-200 border-r border-gray-700 flex flex-col h-full"
    >
      {/* Search Header */}
      <div className="p-4 border-b border-gray-700">
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowUserSearch(!showUserSearch)}
          className="w-full"
        >
          <Plus className="w-5 h-5" />
          Chat Baru
        </Button>
      </div>

      {/* User Search */}
      <AnimatePresence>
        {showUserSearch && (
          <UserSearch
            onSelectUser={handleSelectUser}
            onClose={() => setShowUserSearch(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat List */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div>
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonChatItem key={i} />
            ))}
          </div>
        ) : (
          <ChatList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
          />
        )}
      </div>
    </motion.aside>
  )
}

export default Sidebar
