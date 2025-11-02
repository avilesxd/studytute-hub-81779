import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Clock, MapPin, Users, DollarSign, BookOpen, Mail, Phone, GraduationCap } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import EnrolledStudentsDialog from "@/components/EnrolledStudentsDialog";

type Tutoring = Database["public"]["Tables"]["tutorings"]["Row"];
type TutorApplication = Database["public"]["Tables"]["tutor_applications"]["Row"];

type TutoringWithProfile = Tutoring & {
  profiles: { full_name: string } | null;
};

const DirectorPanel = () => {
  const navigate = useNavigate();
  const { isDirector, isLoading: authLoading, user } = useAuth();
  const [tutorings, setTutorings] = useState<TutoringWithProfile[]>([]);
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isDirector) {
      toast.error("No tienes permisos para acceder a esta página");
      navigate("/");
    }
  }, [isDirector, authLoading, navigate]);

  useEffect(() => {
    if (isDirector) {
      fetchPendingTutorings();
      fetchApplications();
    }
  }, [isDirector]);

  const fetchPendingTutorings = async () => {
    try {
      const { data, error } = await supabase
        .from("tutorings")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTutorings(data as TutoringWithProfile[] || []);
    } catch (error: any) {
      toast.error("Error al cargar las tutorías", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("tutor_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast.error("Error al cargar las postulaciones", {
        description: error.message,
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: Database["public"]["Enums"]["tutoring_status"]) => {
    try {
      const { error } = await supabase
        .from("tutorings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast.success(
        status === "approved" ? "Tutoría aprobada" : "Tutoría rechazada"
      );
      fetchPendingTutorings();
    } catch (error: any) {
      toast.error("Error al actualizar el estado", {
        description: error.message,
      });
    }
  };

  const handleUpdateApplicationStatus = async (
    id: string, 
    status: Database["public"]["Enums"]["tutor_application_status"]
  ) => {
    try {
      const { error } = await supabase
        .from("tutor_applications")
        .update({ 
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      toast.success(
        status === "approved" ? "Postulación aprobada" : "Postulación rechazada"
      );
      fetchApplications();
    } catch (error: any) {
      toast.error("Error al actualizar el estado", {
        description: error.message,
      });
    }
  };

  const handleDeleteTutoring = async (id: string) => {
    try {
      const { error } = await supabase.from("tutorings").delete().eq("id", id);

      if (error) throw error;

      toast.success("Tutoría eliminada exitosamente");
      fetchPendingTutorings();
    } catch (error: any) {
      toast.error("Error al eliminar la tutoría", {
        description: error.message,
      });
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      const { error } = await supabase.from("tutor_applications").delete().eq("id", id);

      if (error) throw error;

      toast.success("Postulación eliminada exitosamente");
      fetchApplications();
    } catch (error: any) {
      toast.error("Error al eliminar la postulación", {
        description: error.message,
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const pendingTutorings = tutorings.filter((t) => t.status === "pending");
  const approvedTutorings = tutorings.filter((t) => t.status === "approved");
  const rejectedTutorings = tutorings.filter((t) => t.status === "rejected");

  const pendingApplications = applications.filter((a) => a.status === "pending");
  const approvedApplications = applications.filter((a) => a.status === "approved");
  const rejectedApplications = applications.filter((a) => a.status === "rejected");

  const renderTutoringCard = (tutoring: TutoringWithProfile) => (
    <Card key={tutoring.id} className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-1">{tutoring.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Por: {tutoring.profiles?.full_name || 'Tutor no encontrado'}
            </p>
          </div>
          <Badge
            variant={
              tutoring.status === "pending"
                ? "secondary"
                : tutoring.status === "approved"
                ? "default"
                : "destructive"
            }
          >
            {tutoring.status === "pending"
              ? "Pendiente"
              : tutoring.status === "approved"
              ? "Aprobada"
              : "Rechazada"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span>{tutoring.schedule}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Sala {tutoring.room}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-primary" />
          <span>
            {tutoring.available_spots} de {tutoring.total_spots} cupos
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="font-semibold">
            ${tutoring.price.toLocaleString()} CLP
          </span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-muted-foreground mb-1 text-xs">Temas:</p>
            <div className="flex flex-wrap gap-1">
              {tutoring.topics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {tutoring.description && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              {tutoring.description}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        {tutoring.status === "pending" && (
          <>
            <Button
              onClick={() => handleUpdateStatus(tutoring.id, "approved")}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              Aprobar
            </Button>
            <Button
              onClick={() => handleUpdateStatus(tutoring.id, "rejected")}
              variant="destructive"
              className="flex-1"
            >
              Rechazar
            </Button>
          </>
        )}
        {tutoring.status === "approved" && (
          <EnrolledStudentsDialog tutoringId={tutoring.id} />
        )}
        <Button
          onClick={() => handleDeleteTutoring(tutoring.id)}
          variant="destructive"
          className="flex-1"
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );

  const renderApplicationCard = (application: TutorApplication) => (
    <Card key={application.id} className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-1">{application.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {application.subject}
            </p>
          </div>
          <Badge
            variant={
              application.status === "pending"
                ? "secondary"
                : application.status === "approved"
                ? "default"
                : "destructive"
            }
          >
            {application.status === "pending"
              ? "Pendiente"
              : application.status === "approved"
              ? "Aprobada"
              : "Rechazada"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-primary" />
          <span>{application.email}</span>
        </div>
        {application.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <span>{application.phone}</span>
          </div>
        )}
        <div className="flex items-start gap-2 text-sm">
          <GraduationCap className="h-4 w-4 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-muted-foreground mb-1 text-xs">Experiencia:</p>
            <p className="text-sm">{application.experience}</p>
          </div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-muted-foreground mb-1 text-xs">Motivación:</p>
          <p className="text-sm">{application.motivation}</p>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        {application.status === "pending" && (
          <>
            <Button
              onClick={() => handleUpdateApplicationStatus(application.id, "approved")}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              Aprobar
            </Button>
            <Button
              onClick={() => handleUpdateApplicationStatus(application.id, "rejected")}
              variant="destructive"
              className="flex-1"
            >
              Rechazar
            </Button>
          </>
        )}
        <Button
          onClick={() => handleDeleteApplication(application.id)}
          variant="destructive"
          className="flex-1"
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">
          Panel del Director
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Postulaciones de Tutores Pendientes ({pendingApplications.length})
            </h2>
            {pendingApplications.length === 0 ? (
              <p className="text-muted-foreground">
                No hay postulaciones pendientes de revisión
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingApplications.map(renderApplicationCard)}
              </div>
            )}
          </section>

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
                {pendingTutorings.map(renderTutoringCard)}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Tutorías Aprobadas ({approvedTutorings.length})
            </h2>
            {approvedTutorings.length === 0 ? (
              <p className="text-muted-foreground">No hay tutorías aprobadas</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedTutorings.map(renderTutoringCard)}
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
                {rejectedTutorings.map(renderTutoringCard)}
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
                {approvedApplications.map(renderApplicationCard)}
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
                {rejectedApplications.map(renderApplicationCard)}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DirectorPanel;
