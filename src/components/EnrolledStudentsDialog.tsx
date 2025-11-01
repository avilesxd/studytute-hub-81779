
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Student = {
  full_name: string;
  email: string;
};

const EnrolledStudentsDialog = ({ tutoringId }: { tutoringId: string }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_enrolled_students", {
        p_tutoring_id: tutoringId,
      });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast.error("Error al cargar los inscritos", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={fetchEnrollments} variant="outline" className="flex-1">
          Ver Inscritos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alumnos Inscritos</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p>Cargando...</p>
        ) : students.length === 0 ? (
          <p>No hay alumnos inscritos en esta tutoría.</p>
        ) : (
          <ul>
            {students.map((student, index) => (
              <li key={index}>
                {student.full_name} ({student.email})
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnrolledStudentsDialog;
