import { useEffect, useState } from "react";
import Header from "@/components/Header";
import TutoringCard from "@/components/TutoringCard";
import BecomeATutorDialog from "@/components/BecomeATutorDialog";
import ApplyAsTutorDialog from "@/components/ApplyAsTutorDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import mathTutoringImage from "@/assets/math-tutoring.jpg";

const Tutoring = () => {
  const { isApprovedTutor } = useAuth();
  const [tutorings, setTutorings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTutorings();
  }, []);

  const fetchTutorings = async () => {
    try {
      const { data, error } = await supabase
        .from("tutorings")
        .select("*")
        .eq("status", "approved")
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

  const filteredTutorings = tutorings.filter((tutoring) => {
    const query = searchQuery.toLowerCase();
    return (
      tutoring.title.toLowerCase().includes(query) ||
      tutoring.tutor_name.toLowerCase().includes(query) ||
      tutoring.topics.some((topic: string) => topic.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                Tutoría Entre Estudiantes
              </h1>
              <p className="text-muted-foreground text-lg">
                Encuentra el apoyo académico que necesitas o comparte tu conocimiento
              </p>
            </div>
            <div className="flex gap-3">
              {isApprovedTutor ? <BecomeATutorDialog /> : <ApplyAsTutorDialog />}
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar tutorías por tema, materia o tutor..."
              className="pl-10 bg-card shadow-sm border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando tutorías...</p>
          </div>
        ) : filteredTutorings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No se encontraron tutorías que coincidan con tu búsqueda"
                : "No hay tutorías disponibles en este momento"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorings.map((tutoring) => (
              <TutoringCard
                key={tutoring.id}
                id={tutoring.id}
                title={tutoring.title}
                tutor={tutoring.tutor_name}
                schedule={tutoring.schedule}
                room={tutoring.room}
                availableSpots={tutoring.available_spots}
                totalSpots={tutoring.total_spots}
                price={tutoring.price}
                materials={tutoring.materials}
                topics={tutoring.topics}
                rating={5}
                image={mathTutoringImage}
                creatorUserId={tutoring.user_id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tutoring;
