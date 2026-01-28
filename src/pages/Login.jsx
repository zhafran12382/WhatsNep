import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import LoginForm from '../components/Auth/LoginForm'
import { Link } from 'react-router-dom'

/**
 * Login page
 */
const Login = () => {
  return (
    <div className="min-h-screen gradient-bg animate-gradient flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-accent-cyan" />
            </Link>
            <h2 className="text-3xl font-bold text-white mb-2">
              Masuk ke WhatsNep
            </h2>
            <p className="text-gray-300">
              Selamat datang kembali!
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </motion.div>
    </div>
  )
}

export default Login
