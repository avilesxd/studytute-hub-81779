import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { getUserApplications } from '@/lib/api'

export function useNotificationsData(user: any) {
  const queryClient = useQueryClient()

  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
    },
    onError: (error: any) => {
      console.error('Error marking notification as read:', error)
    },
  })

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.is_read).length,
    isLoading,
    isError,
    error,
    markAsRead: markAsReadMutation.mutate,
  }
}

export const useGetUserApplications = (user: any) => {
  return useQuery({
    queryKey: ['user-applications', user?.id],
    queryFn: getUserApplications,
    enabled: !!user?.id,
  })
}
