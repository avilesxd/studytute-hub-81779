import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewDialogProps {
  tutoringId: string;
  children: React.ReactNode;
  onReviewSubmit: () => void;
}

export function ReviewDialog({ tutoringId, children, onReviewSubmit }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecciona una calificación");
      return;
    }

    try {
      const { error } = await supabase.rpc("create_review", {
        p_tutoring_id: tutoringId,
        p_rating: rating,
        p_comment: comment,
      });

      if (error) {
        throw error;
      }

      toast.success("Reseña enviada con éxito");
      onReviewSubmit();
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Error al enviar la reseña", {
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deja tu reseña</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Escribe tu comentario aquí..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Enviar reseña</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
