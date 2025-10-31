import { Star, Clock, Users, DollarSign, BookOpen, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TutoringCardProps {
  id: string;
  title: string;
  tutor: string;
  schedule: string;
  room: string;
  availableSpots: number;
  totalSpots: number;
  price: number;
  materials: string[];
  topics: string[];
  rating: number;
  image: string;
  userId: string;
}

const TutoringCard = ({
  id,
  title,
  tutor,
  schedule,
  room,
  availableSpots,
  totalSpots,
  price,
  materials,
  topics,
  rating,
  image,
  userId,
}: TutoringCardProps) => {
  const { user } = useAuth();
  const isOwnTutoring = user?.id === userId;

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para inscribirte");
      return;
    }

    if (availableSpots <= 0) {
      toast.error("No hay cupos disponibles para esta tutoría");
      return;
    }

    try {
      // Check if user is already enrolled
      const { data: existingEnrollment, error: existingEnrollmentError } = await supabase
        .from("tutoring_enrollments")
        .select("id")
        .eq("tutoring_id", id)
        .eq("user_id", user.id)
        .single();

      if (existingEnrollmentError && existingEnrollmentError.code !== "PGRST116") {
        throw existingEnrollmentError;
      }

      if (existingEnrollment) {
        toast.error("Ya estás inscrito en esta tutoría");
        return;
      }

      // Create a new enrollment
      const { error: enrollmentError } = await supabase
        .from("tutoring_enrollments")
        .insert({ tutoring_id: id, user_id: user.id });

      if (enrollmentError) {
        throw enrollmentError;
      }

      // Decrement available spots
      const { error: updateError } = await supabase
        .from("tutorings")
        .update({ available_spots: availableSpots - 1 })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      toast.success("¡Inscripción exitosa!");
      // Optionally, you can update the UI to reflect the new number of available spots
      // This would require lifting the state up to the parent component (Tutoring.tsx)
    } catch (error: any) {
      toast.error("Error al inscribirse", {
        description: error.message,
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-card to-muted/20 border-border/50">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
          {renderStars(rating)}
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">Por: {tutor}</p>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-foreground/80">{schedule}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-foreground/80">Sala {room}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-foreground/80">
            {availableSpots} de {totalSpots} cupos disponibles
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="text-foreground/80 font-semibold">
            ${price.toLocaleString()} CLP
          </span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-muted-foreground mb-1 text-xs">Materiales:</p>
            <div className="flex flex-wrap gap-1">
              {materials.map((material, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground mb-1.5 text-xs">Temas:</p>
          <div className="flex flex-wrap gap-1">
            {topics.map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {isOwnTutoring ? (
          <div className="w-full text-center text-sm text-muted-foreground py-2">
            Esta es tu tutoría
          </div>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-sm"
            onClick={handleEnroll}
          >
            Inscribirse
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TutoringCard;
