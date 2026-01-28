import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

/**
 * Hook to track online/offline status of users
 */
export const useOnlineStatus = () => {
  const { user } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState(new Set())

  useEffect(() => {
    if (!user) return

    // Fetch initial online users
    const fetchOnlineUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('status', 'online')

      if (data) {
        setOnlineUsers(new Set(data.map(u => u.id)))
      }
    }

    fetchOnlineUsers()

    // Subscribe to profile changes
    const channel = supabase
      .channel('online-users')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          setOnlineUsers(prev => {
            const newSet = new Set(prev)
            if (payload.new.status === 'online') {
              newSet.add(payload.new.id)
            } else {
              newSet.delete(payload.new.id)
            }
            return newSet
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return onlineUsers
}
