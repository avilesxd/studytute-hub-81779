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

/**
 * This function fetches tutorings along with associated profiles from a database using Supabase in TypeScript.
 * @returns The `fetchTutorings` function is returning an array of objects that contain tutoring data along with the associated profile data.
 * The data is sorted in descending order based on the `created_at` field. If there is an error during the fetching process, it will be thrown.
 * The returned data is casted as an array of objects that conform to the `TutoringWithProfile` interface,
 */
export const fetchTutorings = async () => {
  const { data, error } = await supabase
    .from('tutorings')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as TutoringWithProfile[]) || []
}

/**
 * This TypeScript function fetches tutor applications along with the profiles of the applicants from a Supabase database and returns them in
 * descending order of creation date.
 * @returns The function `fetchApplications` is returning an array of objects that represent tutor applications along with the associated
 * profiles. The data is fetched from the 'tutor_applications' table in the Supabase database, selecting all columns and also including the
 * 'full_name' field from the 'profiles' table. The results are ordered by the 'created_at' field in descending order. If there is an
 */
export const fetchApplications = async () => {
  const { data, error } = await supabase
    .from('tutor_applications')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as TutorApplicationWithProfile[]) || []
}

/**
 * Retrieves the tutor applications for the current user from the database.
 * @returns An array of tutor applications.
 */
export const getUserApplications = async () => {
  const { data, error } = await supabase.from('tutor_applications').select('*')
  if (error) throw error
  return (data as TutorApplication[]) || []
}
