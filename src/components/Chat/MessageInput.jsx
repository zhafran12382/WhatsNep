import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../UI/Button'
import { sanitizeInput } from '../../utils/validators'

/**
 * Message input component
 */
const MessageInput = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!message.trim() || disabled) return

    const sanitized = sanitizeInput(message)
    onSend(sanitized)
    setMessage('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-700 bg-dark-200"
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan..."
          disabled={disabled}
          className="
            flex-1 resize-none rounded-lg px-4 py-3
            bg-dark-100 border border-gray-700
            text-gray-100 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent
            transition-all duration-200 max-h-32
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          rows={1}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!message.trim() || disabled}
          className="flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </motion.form>
  )
}

export default MessageInput
