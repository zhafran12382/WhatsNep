import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook for subscribing to realtime changes
 */
export const useRealtime = (channel, table, filter, callback) => {
  useEffect(() => {
    if (!channel || !table || !callback) return

    const subscription = supabase
      .channel(channel)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        callback
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [channel, table, filter, callback])
}
