import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { Profile } from '@/types'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  isDirector: boolean
  isApprovedTutor: boolean
  applicationStatus: 'pending' | 'approved' | 'rejected' | null
  isLoading: boolean
  updateProfile: (profile: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isDirector: false,
  isApprovedTutor: false,
  isLoading: true,
  updateProfile: async () => {}
})

/**
 * The useAuth function is a custom hook in TypeScript React that retrieves the authentication context and throws an error if it is not found
 * within the AuthProvider.
 * @returns The `useAuth` custom hook is returning the `context` obtained from the `useContext(AuthContext)` hook. If the `context` is not
 * available (i.e., `!context`), an error is thrown with the message 'useAuth must be used within AuthProvider'.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

/**
 * The AuthProvider function in TypeScript React sets up authentication state listeners and checks user roles for director and approved tutor
 * status.
 * @param  - The code you provided is an `AuthProvider` component that manages authentication state using Supabase. Here's a breakdown of what
 * it does:
 * @returns The `AuthProvider` component is being returned, which wraps the `children` components with the `AuthContext.Provider`. The
 * `AuthProvider` component provides the `AuthContext` value with user information, session data, director status, approved tutor status, and
 * loading state.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isDirector, setIsDirector] = useState(false)
  const [isApprovedTutor, setIsApprovedTutor] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      // Check if user is director and approved tutor
      if (session?.user) {
        setTimeout(() => {
          checkUserRoles(session.user.id)
          getProfile(session.user.id)
        }, 0)
      } else {
        setIsDirector(false)
        setIsApprovedTutor(false)
        setProfile(null)
        setIsLoading(false)
      }
    })

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        checkUserRoles(session.user.id)
        getProfile(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUserRoles = async (userId: string) => {
    try {
      // Check director role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'director')
        .maybeSingle()

      setIsDirector(!!roleData)

      // Check approved tutor status
      const { data: tutorData } = await supabase
        .from('tutor_applications')
        .select('status')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .maybeSingle()

      setIsApprovedTutor(!!tutorData)
    } catch (error) {
      console.error('Error checking user roles:', error)
      setIsDirector(false)
      setIsApprovedTutor(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, major')
        .eq('id', userId)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setProfile({
          fullName: data.full_name,
          avatarUrl: data.avatar_url,
          major: data.major
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const updateProfile = async (profile: Partial<Profile>) => {
    if (!user) {
      return
    }

    try {
      const updateData: {
        full_name?: string
        avatar_url?: string
        major?: string
      } = {}

      if (profile.fullName !== undefined) {
        updateData.full_name = profile.fullName
      }
      if (profile.avatarUrl !== undefined) {
        updateData.avatar_url = profile.avatarUrl
      }
      if (profile.major !== undefined) {
        updateData.major = profile.major
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        throw error
      }

      await getProfile(user.id)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isDirector,
        isApprovedTutor,
        isLoading,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
