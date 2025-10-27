import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Clock, MapPin, Users, DollarSign, BookOpen } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Tutoring = Database["public"]["Tables"]["tutorings"]["Row"];

const DirectorPanel = () => {
  const navigate = useNavigate();
  const { isDirector, isLoading: authLoading } = useAuth();
  const [tutorings, setTutorings] = useState<Tutoring[]>([]);
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
    }
  }, [isDirector]);

  const fetchPendingTutorings = async () => {
    try {
      const { data, error } = await supabase
        .from("tutorings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTutorings(data || []);
    } catch (error: any) {
      toast.error("Error al cargar las tutorías", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
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

  const renderTutoringCard = (tutoring: Tutoring) => (
    <Card key={tutoring.id} className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-1">{tutoring.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Por: {tutoring.tutor_name}
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

      {tutoring.status === "pending" && (
        <CardFooter className="gap-2">
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
        </CardFooter>
      )}
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
        </div>
      </main>
    </div>
  );
};

export default DirectorPanel;
