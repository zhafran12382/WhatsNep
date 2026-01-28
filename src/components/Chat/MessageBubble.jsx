import { motion } from 'framer-motion'
import { formatTime } from '../../utils/formatDate'
import { Check, CheckCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

/**
 * Message bubble component
 */
const MessageBubble = ({ message }) => {
  const { user } = useAuth()
  const isOwn = message.sender_id === user?.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`
          chat-bubble
          ${isOwn
            ? 'bg-gradient-to-r from-accent-purple to-accent-cyan text-white'
            : 'bg-dark-100 text-gray-100'
          }
        `}
      >
        {!isOwn && (
          <p className="text-xs text-gray-400 mb-1">
            {message.sender?.username}
          </p>
        )}
        
        <p className="break-words whitespace-pre-wrap">
          {message.content}
        </p>
        
        <div className={`flex items-center gap-1 mt-1 justify-end`}>
          <span className={`text-xs ${isOwn ? 'text-gray-200' : 'text-gray-500'}`}>
            {formatTime(message.created_at)}
          </span>
          {isOwn && (
            <span className="text-gray-200">
              {message.is_read ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MessageBubble
