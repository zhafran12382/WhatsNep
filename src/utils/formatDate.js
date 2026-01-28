import { formatDistanceToNow, format } from 'date-fns'
import { id } from 'date-fns/locale'

/**
 * Format timestamp to relative time (e.g., "baru saja", "5 menit lalu")
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return ''
  
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = (now - date) / 1000
    
    if (diffInSeconds < 60) {
      return 'baru saja'
    }
    
    return formatDistanceToNow(date, { addSuffix: true, locale: id })
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Format timestamp to readable date/time
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return ''
  
  try {
    const date = new Date(timestamp)
    return format(date, 'dd MMM yyyy HH:mm', { locale: id })
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Format timestamp to time only
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return ''
  
  try {
    const date = new Date(timestamp)
    return format(date, 'HH:mm')
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}
