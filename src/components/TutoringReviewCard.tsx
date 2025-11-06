import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, DollarSign, BookOpen, Calendar } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { TutoringReviewsDialog } from "@/components/TutoringReviewsDialog";
import EnrolledStudentsDialog from "@/components/EnrolledStudentsDialog";
import { UseMutationResult } from "@tanstack/react-query";

type Tutoring = Database["public"]["Tables"]["tutorings"]["Row"];
type TutoringWithProfile = Tutoring & {
  profiles: { full_name: string } | null;
};

type TutoringReviewCardProps = {
  tutoring: TutoringWithProfile;
  updateStatusMutation: UseMutationResult<void, Error, { id: string; status: Database["public"]["Enums"]["tutoring_status"]; }, unknown>;
  deleteMutation: UseMutationResult<void, Error, string, unknown>;
};

export const TutoringReviewCard = ({ tutoring, updateStatusMutation, deleteMutation }: TutoringReviewCardProps) => (
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
          <Calendar className="h-4 w-4 text-primary" />
          <span>{new Date(tutoring.date).toLocaleDateString()}</span>
        </div>
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
            onClick={() => updateStatusMutation.mutate({ id: tutoring.id, status: "approved" })}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
            disabled={updateStatusMutation.isPending}
          >
            Aprobar
          </Button>
          <Button
            onClick={() => updateStatusMutation.mutate({ id: tutoring.id, status: "rejected" })}
            variant="destructive"
            className="flex-1"
            disabled={updateStatusMutation.isPending}
          >
            Rechazar
          </Button>
        </>
      )}
      {tutoring.status === "approved" && (
        <>
          <EnrolledStudentsDialog tutoringId={tutoring.id} />
          <TutoringReviewsDialog tutoringId={tutoring.id} />
        </>
      )}
      <Button
        onClick={() => deleteMutation.mutate(tutoring.id)}
        variant="destructive"
        className="flex-1"
        disabled={deleteMutation.isPending}
      >
        Eliminar
      </Button>
    </CardFooter>
  </Card>
);