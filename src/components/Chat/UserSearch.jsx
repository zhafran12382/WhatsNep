import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../UI/Avatar'
import Input from '../UI/Input'
import { debounce } from '../../utils/helpers'
import { Spinner } from '../UI/Loader'

/**
 * User search component
 */
const UserSearch = ({ onSelectUser, onClose }) => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchUsers = debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }

      setLoading(true)
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('username', `%${query}%`)
          .neq('id', user.id)
          .limit(10)

        if (error) throw error

        setSearchResults(data || [])
      } catch (error) {
        console.error('Error searching users:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    searchUsers(searchQuery)
  }, [searchQuery, user])

  const handleSelectUser = (selectedUser) => {
    onSelectUser(selectedUser)
    setSearchQuery('')
    setSearchResults([])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 border-b border-gray-700 bg-dark-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="Cari pengguna..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          className="flex-1"
        />
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-dark-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <AnimatePresence>
        {loading && (
          <div className="flex justify-center py-4">
            <Spinner size="md" className="text-accent-purple" />
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide"
          >
            {searchResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSelectUser(result)}
                className="flex items-center gap-3 p-3 rounded-lg bg-dark-100 hover:bg-dark-300 cursor-pointer transition-colors"
              >
                <Avatar
                  username={result.username}
                  src={result.avatar_url}
                  online={result.status === 'online'}
                  size="md"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-100">
                    {result.username}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {result.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && searchQuery && searchResults.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-4"
          >
            Tidak ada pengguna ditemukan
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default UserSearch
