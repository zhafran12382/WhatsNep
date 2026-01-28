import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Input from '../UI/Input'
import Button from '../UI/Button'
import Toast from '../UI/Toast'
import { isValidEmail, isValidPassword } from '../../utils/validators'

/**
 * Login form component
 */
const LoginForm = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
  
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
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    
    try {
      const { data, error } = await signIn(formData.email, formData.password)
      
      if (error) {
        setToast({
          show: true,
          message: error.message === 'Invalid login credentials' 
            ? 'Email atau password salah' 
            : error.message,
          type: 'error',
        })
        return
      }
      
      if (data.user) {
        setToast({
          show: true,
          message: 'Login berhasil!',
          type: 'success',
        })
        
        // Redirect to chat after a short delay
        setTimeout(() => {
          navigate('/chat')
        }, 500)
      }
    } catch (error) {
      console.error('Login error:', error)
      setToast({
        show: true,
        message: 'Terjadi kesalahan saat login',
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
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          <LogIn className="w-5 h-5" />
          Masuk
        </Button>
        
        <p className="text-center text-gray-400 text-sm">
          Belum punya akun?{' '}
          <Link
            to="/register"
            className="text-accent-cyan hover:underline font-medium"
          >
            Daftar sekarang
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

export default LoginForm
