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
import { CalendarIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";

const BecomeATutorDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
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
    const title = formData.get("title") as string;
    const schedule = formData.get("schedule") as string;
    const room = formData.get("room") as string;
    const spots = parseInt(formData.get("spots") as string);
    const price = parseInt(formData.get("price") as string);
    const topics = (formData.get("topics") as string)
      .split(",")
      .map((t) => t.trim());
    const materials = (formData.get("materials") as string)
      .split(",")
      .map((m) => m.trim());
    const description = formData.get("description") as string;

    try {
      const { error } = await supabase.from("tutorings").insert({
        user_id: user.id,
        title,
        schedule,
        room,
        available_spots: spots,
        total_spots: spots,
        price,
        materials,
        topics,
        description: description || null,
        date: date?.toISOString(),
      });

      if (error) throw error;

      toast.success("Solicitud enviada exitosamente", {
        description: "El director revisará tu postulación pronto.",
      });
      setOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error("Error al enviar la solicitud", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-opacity shadow-md">
          <Plus className="mr-2 h-5 w-5" />
          Crear tutoria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">
            Crear la Tutoría
          </DialogTitle>
          <DialogDescription>
            Comparte tu conocimiento y ayuda a otros estudiantes. Completa el
            formulario para publicar tu tutoría. El director revisará tu
            solicitud antes de que esté disponible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Tutoría *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ej: Cálculo Diferencial e Integral"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha de la tutoría *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Horario *</Label>
              <Input
                id="schedule"
                name="schedule"
                placeholder="Lunes y Miércoles 15:00-17:00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room">Sala *</Label>
              <Input id="room" name="room" placeholder="205" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spots">Cupos Disponibles *</Label>
              <Input
                id="spots"
                name="spots"
                type="number"
                placeholder="10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio (CLP) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="3000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topics">
              Temas a Tratar (separados por comas) *
            </Label>
            <Textarea
              id="topics"
              name="topics"
              placeholder="Derivadas, integrales, límites, series"
              className="min-h-20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materials">
              Materiales Necesarios (separados por comas) *
            </Label>
            <Textarea
              id="materials"
              name="materials"
              placeholder="Calculadora científica, cuaderno, lápiz"
              className="min-h-20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción Adicional</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Cuéntanos sobre tu experiencia, metodología de enseñanza..."
              className="min-h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-secondary"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Postulación"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BecomeATutorDialog;
