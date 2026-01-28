/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate username (alphanumeric, underscore, dash, 3-20 chars)
 */
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * Check password strength
 * Returns: { strength: 'weak'|'medium'|'strong', score: 0-3 }
 */
export const checkPasswordStrength = (password) => {
  let score = 0
  
  if (!password || password.length === 0) {
    return { strength: 'weak', score: 0 }
  }
  
  // Length check
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  
  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  
  // Determine strength based on score
  if (score <= 2) {
    return { strength: 'weak', score }
  } else if (score <= 3) {
    return { strength: 'medium', score }
  } else {
    return { strength: 'strong', score }
  }
}

/**
 * Validate password (minimum 6 characters)
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6
}

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
