import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, UserPlus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Input from '../UI/Input'
import Button from '../UI/Button'
import Toast from '../UI/Toast'
import PasswordStrength from './PasswordStrength'
import { isValidEmail, isValidPassword, isValidUsername } from '../../utils/validators'
import { debounce } from '../../utils/helpers'

/**
 * Register form component
 */
const RegisterForm = () => {
  const navigate = useNavigate()
  const { signUp, checkUsernameAvailability } = useAuth()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
  
  // Debounced username availability check
  useEffect(() => {
    const checkUsername = debounce(async (username) => {
      if (!username || !isValidUsername(username)) {
        setUsernameAvailable(null)
        return
      }
      
      setCheckingUsername(true)
      const available = await checkUsernameAvailability(username)
      setUsernameAvailable(available)
      setCheckingUsername(false)
    }, 500)
    
    if (formData.username) {
      checkUsername(formData.username)
    } else {
      setUsernameAvailable(null)
    }
  }, [formData.username, checkUsernameAvailability])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.username) {
      newErrors.username = 'Username harus diisi'
    } else if (!isValidUsername(formData.username)) {
      newErrors.username = 'Username hanya boleh mengandung huruf, angka, - dan _ (3-20 karakter)'
    } else if (usernameAvailable === false) {
      newErrors.username = 'Username sudah digunakan'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email harus diisi'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password harus diisi'
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password minimal 6 karakter'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    
    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.username
      )
      
      if (error) {
        setToast({
          show: true,
          message: error.message || 'Terjadi kesalahan saat mendaftar',
          type: 'error',
        })
        return
      }
      
      if (data.user) {
        setToast({
          show: true,
          message: 'Akun berhasil dibuat! Mengarahkan ke halaman chat...',
          type: 'success',
        })
        
        // Redirect to chat after a short delay
        setTimeout(() => {
          navigate('/chat')
        }, 1500)
      }
    } catch (error) {
      console.error('Register error:', error)
      setToast({
        show: true,
        message: 'Terjadi kesalahan saat mendaftar',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="relative">
          <Input
            label="Username"
            type="text"
            name="username"
            placeholder="username_kamu"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            icon={User}
          />
          {formData.username && isValidUsername(formData.username) && (
            <div className="absolute right-3 top-9">
              {checkingUsername ? (
                <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
              ) : usernameAvailable === true ? (
                <span className="text-green-500 text-sm">✓ Tersedia</span>
              ) : usernameAvailable === false ? (
                <span className="text-red-500 text-sm">✗ Sudah digunakan</span>
              ) : null}
            </div>
          )}
        </div>
        
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
        />
        
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Masukkan password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
          />
          <PasswordStrength password={formData.password} />
        </div>
        
        <Input
          label="Konfirmasi Password"
          type="password"
          name="confirmPassword"
          placeholder="Konfirmasi password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={Lock}
        />
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={usernameAvailable === false || checkingUsername}
          className="w-full"
        >
          <UserPlus className="w-5 h-5" />
          Daftar
        </Button>
        
        <p className="text-center text-gray-400 text-sm">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="text-accent-cyan hover:underline font-medium"
          >
            Masuk sekarang
          </Link>
        </p>
      </motion.form>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  )
}

export default RegisterForm
