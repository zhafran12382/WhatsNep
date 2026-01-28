import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react'
import { useEffect } from 'react'

/**
 * Toast notification component
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose, isVisible }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  }
  
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }
  
  const Icon = icons[type]
  
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-4 left-1/2 transform z-50"
        >
          <div className="glass-effect rounded-lg shadow-2xl border border-gray-700 p-4 flex items-center gap-3 min-w-[300px] max-w-md">
            <div className={`${colors[type]} rounded-full p-1`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="flex-1 text-sm text-gray-100">{message}</p>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-dark-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
