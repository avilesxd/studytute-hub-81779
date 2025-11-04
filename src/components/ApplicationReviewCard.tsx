import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, GraduationCap } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { UseMutationResult } from "@tanstack/react-query";

type TutorApplication = Database["public"]["Tables"]["tutor_applications"]["Row"];

type ApplicationReviewCardProps = {
  application: TutorApplication;
  updateStatusMutation: UseMutationResult<void, Error, { id: string; status: Database["public"]["Enums"]["tutor_application_status"]; }, unknown>;
  deleteMutation: UseMutationResult<void, Error, string, unknown>;
};

export const ApplicationReviewCard = ({ application, updateStatusMutation, deleteMutation }: ApplicationReviewCardProps) => (
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
            onClick={() => updateStatusMutation.mutate({ id: application.id, status: "approved" })}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
            disabled={updateStatusMutation.isPending}
          >
            Aprobar
          </Button>
          <Button
            onClick={() => updateStatusMutation.mutate({ id: application.id, status: "rejected" })}
            variant="destructive"
            className="flex-1"
            disabled={updateStatusMutation.isPending}
          >
            Rechazar
          </Button>
        </>
      )}
      <Button
        onClick={() => deleteMutation.mutate(application.id)}
        variant="destructive"
        className="flex-1"
        disabled={deleteMutation.isPending}
      >
        Eliminar
      </Button>
    </CardFooter>
  </Card>
);