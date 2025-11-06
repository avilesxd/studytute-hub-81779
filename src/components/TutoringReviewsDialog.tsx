import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Star, StarHalf } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_avatar_url: string;
};

const fetchReviews = async (tutoringId: string) => {
  const { data, error } = await supabase.rpc("get_reviews_for_tutoring", {
    p_tutoring_id: tutoringId,
  });
  if (error) throw error;
  return data as Review[];
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={`full-${index}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {halfStar && (
        <StarHalf
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      )}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={`empty-${index}`}
          className="h-4 w-4 fill-gray-200 text-gray-200"
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="flex items-start gap-4 border-b pb-4">
    <Avatar>
      <AvatarImage src={review.user_avatar_url} alt={review.user_name} />
      <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{review.user_name}</p>
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {new Date(review.created_at).toLocaleDateString()}
      </p>
      <p className="mt-2 text-sm">{review.comment}</p>
    </div>
  </div>
);

export const TutoringReviewsDialog = ({
  tutoringId,
}: {
  tutoringId: string;
}) => {
  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
  } = useQuery<Review[]>({
    queryKey: ["reviews", tutoringId],
    queryFn: () => fetchReviews(tutoringId),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          Ver Reseñas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Reseñas de la Tutoría</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {isLoading && <p>Cargando reseñas...</p>}
          {isError && <p className="text-red-500">Error: {error.message}</p>}
          {reviews.length === 0 && !isLoading && (
            <p>No hay reseñas para esta tutoría.</p>
          )}
          {reviews.map((review) => (
            <ReviewCard key={review.id.toString()} review={review} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
