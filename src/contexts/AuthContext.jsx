import { createContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  // Fetch user profile
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // Update user online status
  useEffect(() => {
    if (!user) return

    const updateOnlineStatus = async (status) => {
      try {
        await supabase
          .from('profiles')
          .update({
            status,
            last_seen: new Date().toISOString(),
          })
          .eq('id', user.id)
      } catch (error) {
        console.error('Error updating online status:', error)
      }
    }

    // Set online on mount
    updateOnlineStatus('online')

    // Set offline on unmount/page close
    const handleBeforeUnload = () => {
      // Use sendBeacon for more reliable status update on page unload
      const url = `${supabase.supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`
      const data = JSON.stringify({
        status: 'offline',
        last_seen: new Date().toISOString(),
      })
      
      if (navigator.sendBeacon) {
        const blob = new Blob([data], { type: 'application/json' })
        navigator.sendBeacon(url, blob)
      } else {
        // Fallback for browsers that don't support sendBeacon
        updateOnlineStatus('offline')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      updateOnlineStatus('offline')
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [user])

  // Sign up
  const signUp = async (email, password, username) => {
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()

      if (existingUser) {
        throw new Error('Username sudah digunakan')
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) throw error

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username,
              status: 'online',
              created_at: new Date().toISOString(),
            },
          ])

        if (profileError) throw profileError
      }

      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  // Sign in
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      // Update status to offline before signing out
      if (user) {
        await supabase
          .from('profiles')
          .update({
            status: 'offline',
            last_seen: new Date().toISOString(),
          })
          .eq('id', user.id)
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
      setSession(null)
      
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { error }
    }
  }

  // Check username availability
  const checkUsernameAvailability = async (username) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()

      if (error && error.code === 'PGRST116') {
        // No rows returned, username is available
        return true
      }

      return !data // If data exists, username is taken
    } catch (error) {
      console.error('Error checking username:', error)
      return false
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updatePassword,
    checkUsernameAvailability,
    fetchProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
