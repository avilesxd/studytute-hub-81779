import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'

export type Tutoring = Database['public']['Tables']['tutorings']['Row']
export type TutorApplication =
  Database['public']['Tables']['tutor_applications']['Row']

export type TutoringWithProfile = Tutoring & {
  profiles: { full_name: string } | null
}

export type TutorApplicationWithProfile = TutorApplication & {
  profiles: { full_name: string } | null
}

export const fetchTutorings = async () => {
  const { data, error } = await supabase
    .from('tutorings')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as TutoringWithProfile[]) || []
}

export const fetchApplications = async () => {
  const { data, error } = await supabase
    .from('tutor_applications')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as TutorApplicationWithProfile[]) || []
}
