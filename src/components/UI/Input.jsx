import { forwardRef } from 'react'
import { motion } from 'framer-motion'

/**
 * Input component with label, error state, and icon support
 */
const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <motion.input
          ref={ref}
          type={type}
          className={`
            w-full rounded-lg px-4 py-2.5
            ${Icon ? 'pl-10' : ''}
            bg-dark-100 border
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-accent-purple'}
            text-gray-100 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-all duration-200
            ${className}
          `}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
