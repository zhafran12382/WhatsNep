import { motion } from 'framer-motion'

/**
 * Spinner loader
 */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }
  
  return (
    <motion.div
      className={`${sizes[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </motion.div>
  )
}

/**
 * Skeleton loader for chat list items
 */
export const SkeletonChatItem = () => {
  return (
    <div className="flex items-center gap-3 p-4 animate-pulse">
      <div className="w-12 h-12 bg-dark-100 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-dark-100 rounded w-3/4 mb-2" />
        <div className="h-3 bg-dark-100 rounded w-1/2" />
      </div>
    </div>
  )
}

/**
 * Skeleton loader for messages
 */
export const SkeletonMessage = ({ align = 'left' }) => {
  return (
    <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'} mb-4 animate-pulse`}>
      <div className={`max-w-md ${align === 'right' ? 'bg-accent-purple' : 'bg-dark-100'} rounded-2xl p-4`}>
        <div className="h-4 bg-white bg-opacity-20 rounded w-48 mb-2" />
        <div className="h-4 bg-white bg-opacity-20 rounded w-32" />
      </div>
    </div>
  )
}

/**
 * Full page loader
 */
export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-dark-300 flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4 text-accent-purple" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

const Loader = { Spinner, SkeletonChatItem, SkeletonMessage, PageLoader }

export default Loader
