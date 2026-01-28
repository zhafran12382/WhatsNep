import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MessageCircle, Lock, Zap, Shield } from 'lucide-react'
import Button from '../components/UI/Button'

/**
 * Landing page
 */
const Landing = () => {
  return (
    <div className="min-h-screen gradient-bg animate-gradient flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <MessageCircle className="w-24 h-24 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              WhatsNep
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Chat Modern, Aman, dan Indah
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                Mulai Sekarang
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="lg" className="min-w-[200px] border-2 border-white text-white hover:bg-white hover:text-primary-600">
                Masuk
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-effect rounded-2xl p-8 text-center"
            >
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Cepat & Real-time
              </h3>
              <p className="text-gray-300">
                Pesan terkirim secara instan dengan teknologi real-time
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-effect rounded-2xl p-8 text-center"
            >
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Aman & Private
              </h3>
              <p className="text-gray-300">
                Keamanan data dan privasi adalah prioritas utama kami
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-effect rounded-2xl p-8 text-center"
            >
              <Lock className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Mudah Digunakan
              </h3>
              <p className="text-gray-300">
                Interface intuitif yang mudah dipahami siapa saja
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Landing
