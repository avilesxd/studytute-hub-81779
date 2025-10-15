import { Star, Clock, Users, DollarSign, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TutoringCardProps {
  id: number;
  title: string;
  tutor: string;
  schedule: string;
  availableSpots: number;
  totalSpots: number;
  price: number;
  materials: string[];
  topics: string[];
  rating: number;
  image: string;
}

const TutoringCard = ({
  title,
  tutor,
  schedule,
  availableSpots,
  totalSpots,
  price,
  materials,
  topics,
  rating,
  image,
}: TutoringCardProps) => {
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
        <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-sm">
          Inscribirse
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TutoringCard;
