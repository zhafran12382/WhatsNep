import { motion } from 'framer-motion'
import { LogOut, Settings as SettingsIcon, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../UI/Avatar'

/**
 * Header component
 */
const Header = ({ showSettings = true }) => {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-200 border-b border-gray-700 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-accent-cyan" />
          <h1 className="text-2xl font-bold gradient-text">
            WhatsNep
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {showSettings && (
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg hover:bg-dark-100 transition-colors"
              title="Pengaturan"
            >
              <SettingsIcon className="w-5 h-5 text-gray-400" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <Avatar
              username={profile?.username}
              src={profile?.avatar_url}
              size="sm"
              showStatus={false}
            />
            <span className="text-sm text-gray-300 hidden md:block">
              {profile?.username}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg hover:bg-dark-100 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
