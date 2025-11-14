import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'
import { fetchTutorings, fetchApplications } from '@/lib/api'
import { toast } from 'sonner'

// Hook for managing tutorings data
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
    }: {
      id: string
      status: Database['public']['Enums']['tutor_application_status']
    }) => {
      const { error } = await supabase
        .from('tutor_applications')
        .update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_, { status }) => {
      toast.success(
        status === 'approved'
          ? 'Postulación aprobada'
          : 'Postulación rechazada',
      )
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: (error: any) => {
      toast.error('Error al actualizar el estado', {
        description: error.message,
      })
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
    delete: deleteMutation,
  }
}
