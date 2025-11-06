import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TutoringReviewCard } from "@/components/TutoringReviewCard";
import { ApplicationReviewCard } from "@/components/ApplicationReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tutoring = Database["public"]["Tables"]["tutorings"]["Row"];
type TutorApplication =
  Database["public"]["Tables"]["tutor_applications"]["Row"];

type TutoringWithProfile = Tutoring & {
  profiles: { full_name: string } | null;
};

type TutorApplicationWithProfile = TutorApplication & {
  profiles: { full_name: string } | null;
};

// Data Fetching functions
const fetchTutorings = async () => {
  const { data, error } = await supabase
    .from("tutorings")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as TutoringWithProfile[]) || [];
};

const fetchApplications = async () => {
  const { data, error } = await supabase
    .from("tutor_applications")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as TutorApplicationWithProfile[]) || [];
};

const DirectorPanel = () => {
  const navigate = useNavigate();
  const { isDirector, isLoading: authLoading, user } = useAuth();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: tutorings = [],
    isLoading: tutoringsLoading,
    isError: tutoringsError,
    error: tutoringsErrorMsg,
  } = useQuery<TutoringWithProfile[]>({
    queryKey: ["tutorings"],
    queryFn: fetchTutorings,
    enabled: !!isDirector,
  });
  const {
    data: applications = [],
    isLoading: applicationsLoading,
    isError: applicationsError,
        error: applicationsErrorMsg,
      } = useQuery<TutorApplicationWithProfile[]>(
        {
        queryKey: ["applications"],
        queryFn: fetchApplications,
        enabled: !!isDirector,
    
  });

  // Mutations
  const updateTutoringStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Database["public"]["Enums"]["tutoring_status"];
    }) => {
      const { error } = await supabase
        .from("tutorings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      toast.success(
        status === "approved" ? "Tutoría aprobada" : "Tutoría rechazada"
      );
      queryClient.invalidateQueries({ queryKey: ["tutorings"] });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar el estado", {
        description: error.message,
      });
    },
  });

  const deleteTutoring = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tutorings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tutoría eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["tutorings"] });
    },
    onError: (error: any) => {
      toast.error("Error al eliminar la tutoría", {
        description: error.message,
      });
    },
  });

  const updateApplicationStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Database["public"]["Enums"]["tutor_application_status"];
    }) => {
      const { error } = await supabase
        .from("tutor_applications")
        .update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      toast.success(
        status === "approved" ? "Postulación aprobada" : "Postulación rechazada"
      );
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar el estado", {
        description: error.message,
      });
    },
  });

  const deleteApplication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tutor_applications")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Postulación eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error: any) => {
      toast.error("Error al eliminar la postulación", {
        description: error.message,
      });
    },
  });

  // Authorization Effect
  if (!authLoading && !isDirector) {
    toast.error("No tienes permisos para acceder a esta página");
    navigate("/");
  }

  // Memoized data filtering
  const pendingTutorings = useMemo(
    () => tutorings.filter((t) => t.status === "pending"),
    [tutorings]
  );
  const approvedTutorings = useMemo(
    () => tutorings.filter((t) => t.status === "approved"),
    [tutorings]
  );
  const rejectedTutorings = useMemo(
    () => tutorings.filter((t) => t.status === "rejected"),
    [tutorings]
  );

  const pendingApplications = useMemo(
    () => applications.filter((a) => a.status === "pending"),
    [applications]
  );
  const approvedApplications = useMemo(
    () => applications.filter((a) => a.status === "approved"),
    [applications]
  );
  const rejectedApplications = useMemo(
    () => applications.filter((a) => a.status === "rejected"),
    [applications]
  );

  if (authLoading || tutoringsLoading || applicationsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (tutoringsError || applicationsError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">
          Error al cargar los datos:{" "}
          {tutoringsErrorMsg?.message || applicationsErrorMsg?.message}
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-primary mb-8">
        Panel del Director
      </h1>

      <Tabs defaultValue="tutorings">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tutorings">Tutorías</TabsTrigger>
          <TabsTrigger value="applications">Postulaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="tutorings">
          <div className="space-y-8 mt-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Tutorías Pendientes ({pendingTutorings.length})
              </h2>
              {pendingTutorings.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay tutorías pendientes de aprobación
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingTutorings.map((tutoring) => (
                    <TutoringReviewCard
                      key={tutoring.id}
                      tutoring={tutoring}
                      updateStatusMutation={updateTutoringStatus}
                      deleteMutation={deleteTutoring}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Tutorías Aprobadas ({approvedTutorings.length})
              </h2>
              {approvedTutorings.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay tutorías aprobadas
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedTutorings.map((tutoring) => (
                    <TutoringReviewCard
                      key={tutoring.id}
                      tutoring={tutoring}
                      updateStatusMutation={updateTutoringStatus}
                      deleteMutation={deleteTutoring}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Tutorías Rechazadas ({rejectedTutorings.length})
              </h2>
              {rejectedTutorings.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay tutorías rechazadas
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rejectedTutorings.map((tutoring) => (
                    <TutoringReviewCard
                      key={tutoring.id}
                      tutoring={tutoring}
                      updateStatusMutation={updateTutoringStatus}
                      deleteMutation={deleteTutoring}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </TabsContent>
        <TabsContent value="applications">
          <div className="space-y-8 mt-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Postulaciones de Tutores Pendientes (
                {pendingApplications.length})
              </h2>
              {pendingApplications.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay postulaciones pendientes de revisión
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingApplications.map((app) => (
                    <ApplicationReviewCard
                      key={app.id}
                      application={app}
                      updateStatusMutation={updateApplicationStatus}
                      deleteMutation={deleteApplication}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Postulaciones Aprobadas ({approvedApplications.length})
              </h2>
              {approvedApplications.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay postulaciones aprobadas
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedApplications.map((app) => (
                    <ApplicationReviewCard
                      key={app.id}
                      application={app}
                      updateStatusMutation={updateApplicationStatus}
                      deleteMutation={deleteApplication}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Postulaciones Rechazadas ({rejectedApplications.length})
              </h2>
              {rejectedApplications.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay postulaciones rechazadas
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rejectedApplications.map((app) => (
                    <ApplicationReviewCard
                      key={app.id}
                      application={app}
                      updateStatusMutation={updateApplicationStatus}
                      deleteMutation={deleteApplication}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DirectorPanel;
