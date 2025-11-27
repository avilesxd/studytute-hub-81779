import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'
import { fetchTutorings, fetchApplications } from '@/lib/api'
import { toast } from 'sonner'

/**
 * These TypeScript functions manage data related to tutorings and applications, including updating status and deleting entries.
 * @param {boolean} isDirector - The `isDirector` parameter in the functions `useTutoringsData` and `useApplicationsData` is a boolean value
 * that indicates whether the user accessing the data is a director or not. This parameter is used to determine whether certain actions should
 * be enabled or disabled based on the user's role
 * @param {any} user - The `user` parameter in the functions `useTutoringsData` and `useApplicationsData` is an object that represents the
 * current user. It likely contains information about the user, such as their ID, role, and other relevant details needed for fetching and
 * updating data related to tutorings and
 * @returns The `useTutoringsData` and `useApplicationsData` functions are returning an object with the following properties:
 */
export function useTutoringsData(isDirector: boolean, user: any) {
  const queryClient = useQueryClient()

  const {
    data: tutorings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tutorings'],
    queryFn: fetchTutorings,
    enabled: !!isDirector,
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: Database['public']['Enums']['tutoring_status']
    }) => {
      const { error } = await supabase
        .from('tutorings')
        .update({ status })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_, { status }) => {
      toast.success(
        status === 'approved' ? 'Tutoría aprobada' : 'Tutoría rechazada',
      )
      queryClient.invalidateQueries({ queryKey: ['tutorings'] })
    },
    onError: (error: any) => {
      toast.error('Error al actualizar el estado', {
        description: error.message,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tutorings').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Tutoría eliminada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['tutorings'] })
    },
    onError: (error: any) => {
      toast.error('Error al eliminar la tutoría', {
        description: error.message,
      })
    },
  })

  return {
    tutorings,
    isLoading,
    isError,
    error,
    updateStatus: updateStatusMutation,
    delete: deleteMutation,
  }
}

// Hook for managing applications data
export function useApplicationsData(isDirector: boolean, user: any) {
  const queryClient = useQueryClient()

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    enabled: !!isDirector,
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      rejection_reason,
    }: {
      id: string
      status: Database['public']['Enums']['tutor_application_status']
      rejection_reason?: string
    }) => {
      // First, get the application to get the user_id
      const { data: application, error: fetchError } = await supabase
        .from('tutor_applications')
        .select('user_id')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      const { error } = await supabase
        .from('tutor_applications')
        .update({
          status,
          rejection_reason,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error

      // If rejected, create a notification
      if (status === 'rejected' && application?.user_id) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: application.user_id,
            message: `Tu postulación para ser tutor ha sido rechazada. Motivo: ${
              rejection_reason || 'No especificado'
            }`,
            link: '/perfil',
          })
        if (notificationError) {
          console.error('Error creating notification:', notificationError)
          // Don't block the main flow if notification fails
        }
      }
    },
    onSuccess: (_, { status }) => {
      toast.success(
        status === 'approved'
          ? 'Postulación aprobada'
          : 'Postulación rechazada',
      )
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      if (status === 'rejected') {
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      }
    },
    onError: (error: any) => {
      toast.error('Error al actualizar el estado', {
        description: error.message,
      })
    },
  })

  const updateNotifiedMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tutor_applications')
        .update({ notified: true })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: (error: any) => {
      console.error('Error al actualizar el estado de la notificación', error)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tutor_applications')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Postulación eliminada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: (error: any) => {
      toast.error('Error al eliminar la postulación', {
        description: error.message,
      })
    },
  })

  return {
    applications,
    isLoading,
    isError,
    error,
    updateStatus: updateStatusMutation,
    updateNotified: updateNotifiedMutation,
    delete: deleteMutation,
  }
}
