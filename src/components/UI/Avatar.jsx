import { getInitials, getAvatarColor } from '../../utils/helpers'

/**
 * Avatar component with status indicator
 */
const Avatar = ({
  src,
  username,
  online = false,
  size = 'md',
  showStatus = true,
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }
  
  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  }
  
  const avatarColor = getAvatarColor(username)
  const initials = getInitials(username)
  
  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={username}
          className={`${sizes[size]} rounded-full object-cover border-2 border-gray-700`}
        />
      ) : (
        <div
          className={`
            ${sizes[size]} ${avatarColor}
            rounded-full flex items-center justify-center
            font-semibold text-white border-2 border-gray-700
          `}
        >
          {initials}
        </div>
      )}
      
      {showStatus && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${online ? 'bg-green-500' : 'bg-gray-500'}
            rounded-full border-2 border-dark-300
          `}
        />
      )}
    </div>
  )
}

export default Avatar
