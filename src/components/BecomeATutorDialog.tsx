import { useState } from "react";
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
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

const BecomeATutorDialog = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitud enviada exitosamente", {
      description: "Revisaremos tu postulación y te contactaremos pronto.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-opacity shadow-md">
          <UserPlus className="mr-2 h-5 w-5" />
          Postular como Tutor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Postular como Tutor</DialogTitle>
          <DialogDescription>
            Comparte tu conocimiento y ayuda a otros estudiantes. Completa el formulario para publicar tu tutoría.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Tutoría *</Label>
              <Input id="title" placeholder="Ej: Cálculo Diferencial e Integral" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio (CLP) *</Label>
              <Input id="price" type="number" placeholder="15000" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Horario *</Label>
              <Input id="schedule" placeholder="Lunes y Miércoles 15:00-17:00" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Sala *</Label>
              <Input id="room" placeholder="205" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spots">Cupos Disponibles *</Label>
              <Input id="spots" type="number" placeholder="10" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio (CLP) *</Label>
              <Input id="price" type="number" placeholder="3000" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topics">Temas a Tratar *</Label>
            <Textarea
              id="topics"
              placeholder="Derivadas, integrales, límites, series, etc."
              className="min-h-20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materials">Materiales Necesarios *</Label>
            <Textarea
              id="materials"
              placeholder="Calculadora científica, cuaderno, lápiz..."
              className="min-h-20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción Adicional</Label>
            <Textarea
              id="description"
              placeholder="Cuéntanos sobre tu experiencia, metodología de enseñanza..."
              className="min-h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
              Enviar Postulación
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BecomeATutorDialog;
