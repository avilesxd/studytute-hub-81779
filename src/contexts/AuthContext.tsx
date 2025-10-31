import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isDirector: boolean;
  isApprovedTutor: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isDirector: false,
  isApprovedTutor: false,
  isLoading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isDirector, setIsDirector] = useState(false);
  const [isApprovedTutor, setIsApprovedTutor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user is director and approved tutor
        if (session?.user) {
          setTimeout(() => {
            checkUserRoles(session.user.id);
          }, 0);
        } else {
          setIsDirector(false);
          setIsApprovedTutor(false);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserRoles(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRoles = async (userId: string) => {
    try {
      // Check director role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "director")
        .maybeSingle();

      setIsDirector(!!roleData);

      // Check approved tutor status
      const { data: tutorData } = await supabase
        .from("tutor_applications")
        .select("status")
        .eq("user_id", userId)
        .eq("status", "approved")
        .maybeSingle();

      setIsApprovedTutor(!!tutorData);
    } catch (error) {
      console.error("Error checking user roles:", error);
      setIsDirector(false);
      setIsApprovedTutor(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isDirector, isApprovedTutor, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
