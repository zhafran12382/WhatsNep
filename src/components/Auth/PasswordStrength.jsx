import { motion } from 'framer-motion'
import { checkPasswordStrength } from '../../utils/validators'

/**
 * Password strength indicator component
 */
const PasswordStrength = ({ password }) => {
  const { strength, score } = checkPasswordStrength(password)
  
  if (!password || password.length === 0) {
    return null
  }
  
  const colors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  }
  
  const labels = {
    weak: 'Lemah',
    medium: 'Sedang',
    strong: 'Kuat',
  }
  
  const widthPercentage = (score / 5) * 100
  
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Kekuatan Password:</span>
        <span className={`text-xs font-medium ${
          strength === 'weak' ? 'text-red-500' :
          strength === 'medium' ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          {labels[strength]}
        </span>
      </div>
      <div className="h-1.5 bg-dark-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${colors[strength]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${widthPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <p>Tips: Gunakan minimal 8 karakter dengan kombinasi huruf besar, kecil, angka, dan simbol</p>
      </div>
    </div>
  )
}

export default PasswordStrength
