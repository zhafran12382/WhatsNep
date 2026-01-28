import { motion } from 'framer-motion'

/**
 * Typing indicator component
 */
const TypingIndicator = ({ username }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 mb-4"
    >
      <div className="bg-dark-100 rounded-2xl px-4 py-2 flex items-center gap-1">
        <span className="text-sm text-gray-400">{username} sedang mengetik</span>
        <div className="flex gap-1 ml-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default TypingIndicator
