import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ApplyAsTutorDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Debes iniciar sesión para postular como tutor");
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const subject = formData.get("subject") as string;
    const experience = formData.get("experience") as string;
    const motivation = formData.get("motivation") as string;

    try {
      const { error } = await supabase.from("tutor_applications").insert({
        user_id: user.id,
        name,
        email,
        phone: phone || null,
        subject,
        experience,
        motivation,
      });

      if (error) throw error;

      toast.success("Postulación enviada exitosamente", {
        description: "El director revisará tu solicitud pronto.",
      });
      setOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error("Error al enviar la postulación", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <GraduationCap className="mr-2 h-5 w-5" />
          Postular como Tutor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Postular como Tutor</DialogTitle>
          <DialogDescription>
            Completa el formulario para postular como tutor. El director revisará tu solicitud.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input id="name" name="name" placeholder="Juan Pérez" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input id="email" name="email" type="email" placeholder="juan@ejemplo.com" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+56 9 1234 5678" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Materia/Tema *</Label>
              <Input id="subject" name="subject" placeholder="Matemáticas, Física, Programación..." required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experiencia Académica *</Label>
            <Textarea
              id="experience"
              name="experience"
              placeholder="Cuéntanos sobre tus logros académicos, cursos aprobados con buenas calificaciones, proyectos relevantes..."
              className="min-h-24"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">¿Por qué quieres ser tutor? *</Label>
            <Textarea
              id="motivation"
              name="motivation"
              placeholder="Comparte tu motivación para enseñar y ayudar a otros estudiantes..."
              className="min-h-24"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-secondary" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Postulación"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyAsTutorDialog;
