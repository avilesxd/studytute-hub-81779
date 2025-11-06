import {
  Star,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { FormatDate } from "@/utils/formatDate";
import { ReviewDialog } from "./ReviewDialog";

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
  onEnrollment: () => void;
  date: string;
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
  onEnrollment,
  date,
}: TutoringCardProps) => {
  const { user } = useAuth();
  const isOwnTutoring = user?.id === userId;
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentAvailableSpots, setCurrentAvailableSpots] =
    useState(availableSpots);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const fetchStats = async () => {
    const { data, error } = await supabase.rpc("get_tutoring_stats", {
      p_tutoring_id: id,
    });

    if (data && !error) {
      const stats = data[0];
      if (stats.review_count > 0 && stats.average_rating) {
        setAverageRating(stats.average_rating);
        setReviewCount(stats.review_count);
      } else {
        setAverageRating(0);
        setReviewCount(0);
      }
    }
  };

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("tutoring_enrollments")
        .select("id")
        .eq("tutoring_id", id)
        .eq("user_id", user.id)
        .single();

      if (data && !error) {
        setIsEnrolled(true);
      }
    };

    checkEnrollment();
    fetchStats();
  }, [user, id]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para inscribirte");
      return;
    }

    if (currentAvailableSpots <= 0) {
      toast.error("No hay cupos disponibles para esta tutoría");
      return;
    }

    try {
      const { error } = await supabase.rpc("enroll_in_tutoring", {
        p_tutoring_id: id,
        p_user_id: user.id,
      });

      if (error) {
        throw error;
      }

      toast.success("¡Inscripción exitosa!");
      setIsEnrolled(true);
      setCurrentAvailableSpots(currentAvailableSpots - 1);
      onEnrollment();
    } catch (error: any) {
      toast.error("Error al inscribirse", {
        description: error.message,
      });
    }
  };

  const handleReviewSubmit = () => {
    fetchStats();
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
          {renderStars(averageRating)}
          <span className="text-xs text-muted-foreground ml-1">
            ({reviewCount})
          </span>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">Por: {tutor}</p>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-foreground/80">{FormatDate(date)}</span>
        </div>

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
            {currentAvailableSpots} de {totalSpots} cupos disponibles
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
        ) : isEnrolled ? (
          <div className="flex flex-col w-full gap-2">
            <Button disabled className="w-full bg-green-500 text-white">
              Ya estás inscrito
            </Button>
            <ReviewDialog tutoringId={id} onReviewSubmit={handleReviewSubmit}>
              <Button variant="outline" className="w-full">
                Dejar una reseña
              </Button>
            </ReviewDialog>
          </div>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-sm"
            onClick={handleEnroll}
            disabled={currentAvailableSpots <= 0}
          >
            {currentAvailableSpots <= 0 ? "No hay cupos" : "Inscribirse"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TutoringCard;
