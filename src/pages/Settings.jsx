import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/UI/Input'
import Button from '../components/UI/Button'
import Toast from '../components/UI/Toast'
import PasswordStrength from '../components/Auth/PasswordStrength'
import { isValidPassword } from '../utils/validators'
import Header from '../components/Layout/Header'

/**
 * Settings page
 */
const Settings = () => {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password baru harus diisi'
    } else if (!isValidPassword(formData.newPassword)) {
      newErrors.newPassword = 'Password minimal 6 karakter'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi'
    } else if (formData.newPassword !== formData.confirmPassword) {
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
      const { error } = await updatePassword(formData.newPassword)

      if (error) {
        setToast({
          show: true,
          message: error.message || 'Gagal mengubah password',
          type: 'error',
        })
        return
      }

      setToast({
        show: true,
        message: 'Password berhasil diubah!',
        type: 'success',
      })

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      // Redirect to chat after a short delay
      setTimeout(() => {
        navigate('/chat')
      }, 1500)
    } catch (error) {
      console.error('Update password error:', error)
      setToast({
        show: true,
        message: 'Terjadi kesalahan saat mengubah password',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header showSettings={false} />

      <div className="flex-1 overflow-y-auto bg-dark-300 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Chat
            </button>

            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              Pengaturan
            </h1>
            <p className="text-gray-400">
              Kelola akun dan keamanan Anda
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-200 rounded-2xl p-6 md:p-8 border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              Ubah Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Password Baru"
                  type="password"
                  name="newPassword"
                  placeholder="Masukkan password baru"
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                  icon={Lock}
                />
                <PasswordStrength password={formData.newPassword} />
              </div>

              <Input
                label="Konfirmasi Password Baru"
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi password baru"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={Lock}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  )
}

export default Settings
