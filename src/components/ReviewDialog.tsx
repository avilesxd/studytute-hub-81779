import { useState, useEffect } from "react";
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
  reviewId?: number;
  initialRating?: number;
  initialComment?: string;
}

export function ReviewDialog({
  tutoringId,
  children,
  onReviewSubmit,
  reviewId,
  initialRating = 0,
  initialComment = "",
}: ReviewDialogProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setComment(initialComment);
    }
  }, [isOpen, initialRating, initialComment]);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecciona una calificación");
      return;
    }

    try {
      const rpcName = reviewId ? "update_review" : "create_review";
      const params = reviewId
        ? { p_review_id: reviewId, p_rating: rating, p_comment: comment }
        : { p_tutoring_id: tutoringId, p_rating: rating, p_comment: comment };

      const { error } = await supabase.rpc(rpcName, params as any);

      if (error) {
        throw error;
      }

      toast.success(`Reseña ${reviewId ? "actualizada" : "enviada"} con éxito`);
      onReviewSubmit();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(`Error al ${reviewId ? "actualizar" : "enviar"} la reseña`, {
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {reviewId ? "Editar reseña" : "Deja tu reseña"}
          </DialogTitle>
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
          <Button onClick={handleSubmit}>
            {reviewId ? "Guardar cambios" : "Enviar reseña"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
