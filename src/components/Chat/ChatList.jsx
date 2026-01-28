import { motion } from 'framer-motion'
import Avatar from '../UI/Avatar'
import { formatRelativeTime } from '../../utils/formatDate'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

/**
 * Chat list item component
 */
const ChatList = ({ conversations, activeConversation, onSelectConversation }) => {
  const onlineUsers = useOnlineStatus()

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <p className="text-gray-400 mb-2">Belum ada percakapan</p>
        <p className="text-sm text-gray-500">Cari pengguna untuk memulai chat</p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full scrollbar-hide">
      {conversations.map((conversation) => {
        const isActive = activeConversation === conversation.id
        const isOnline = onlineUsers.has(conversation.otherUser?.id)

        return (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelectConversation(conversation.id)}
            className={`
              flex items-center gap-3 p-4 cursor-pointer
              border-b border-gray-700 transition-all
              ${isActive ? 'bg-dark-100' : 'hover:bg-dark-100'}
            `}
          >
            <Avatar
              username={conversation.otherUser?.username}
              src={conversation.otherUser?.avatar_url}
              online={isOnline}
              size="md"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-100 truncate">
                  {conversation.otherUser?.username || 'Unknown User'}
                </h3>
                {conversation.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(conversation.lastMessage.created_at)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400 truncate">
                  {conversation.lastMessage?.content || 'Tidak ada pesan'}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="ml-2 bg-accent-purple text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ChatList
