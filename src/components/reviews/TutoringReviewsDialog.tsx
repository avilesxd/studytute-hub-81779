import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Star, StarHalf } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type Review = {
  id: number
  rating: number
  comment: string
  created_at: string
  user_name: string
  user_avatar_url: string
}

/**
 * This function fetches reviews for a specific tutoring session using Supabase's RPC feature in a TypeScript React application.
 * @param {string} tutoringId - The `tutoringId` parameter is a string that represents the unique identifier of a tutoring session. It is used
 * to fetch reviews associated with that specific tutoring session.
 * @returns The function `fetchReviews` is returning a Promise that resolves to an array of `Review` objects.
 */
const fetchReviews = async (tutoringId: string) => {
  const { data, error } = await supabase.rpc('get_reviews_for_tutoring', {
    p_tutoring_id: tutoringId,
  })
  if (error) throw error
  return data as Review[]
}

/* The `renderStars` function is responsible for generating a visual representation of a star rating based on a numerical rating input. Here's
a breakdown of what the function does: */
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  return (
    <div className='flex items-center'>
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={`full-${index}`}
          className='h-4 w-4 fill-yellow-400 text-yellow-400'
        />
      ))}
      {halfStar && (
        <StarHalf
          key='half'
          className='h-4 w-4 fill-yellow-400 text-yellow-400'
        />
      )}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={`empty-${index}`}
          className='h-4 w-4 fill-gray-200 text-gray-200'
        />
      ))}
    </div>
  )
}

/**
 * The ReviewCard component displays a review with user information, rating, date, and comment in a structured layout.
 * @param  - The `ReviewCard` component takes a `review` object as a prop, which should have the following structure:
 */
const ReviewCard = ({ review }: { review: Review }) => (
  <div className='flex items-start gap-4 border-b pb-4'>
    <Avatar>
      <AvatarImage src={review.user_avatar_url} alt={review.user_name} />
      <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className='flex-1'>
      <div className='flex items-center justify-between'>
        <p className='font-semibold'>{review.user_name}</p>
        <div className='flex items-center gap-1'>
          {renderStars(review.rating)}
        </div>
      </div>
      <p className='text-sm text-muted-foreground'>
        {new Date(review.created_at).toLocaleDateString()}
      </p>
      <p className='mt-2 text-sm'>{review.comment}</p>
    </div>
  </div>
)

/**
 * This function displays a dialog box showing reviews for a specific tutoring session.
 * @param  - The code you provided is a React component called `TutoringReviewsDialog` that displays reviews for a specific tutoring session.
 * Here's an explanation of the parameters used in the component:
 * @returns The `TutoringReviewsDialog` component is being returned. It is a dialog component that displays reviews for a specific tutoring
 * session. The component fetches reviews using the `useQuery` hook, and then renders the reviews in a dialog box with appropriate loading,
 * error, and empty state handling.
 */
export const TutoringReviewsDialog = ({
  tutoringId,
}: {
  tutoringId: string
}) => {
  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
  } = useQuery<Review[]>({
    queryKey: ['reviews', tutoringId],
    queryFn: () => fetchReviews(tutoringId),
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='flex-1'>
          Ver Reseñas
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Reseñas de la Tutoría</DialogTitle>
        </DialogHeader>
        <div className='mt-4 space-y-6'>
          {isLoading && <p>Cargando reseñas...</p>}
          {isError && <p className='text-red-500'>Error: {error.message}</p>}
          {reviews.length === 0 && !isLoading && (
            <p>No hay reseñas para esta tutoría.</p>
          )}
          {reviews.map((review) => (
            <ReviewCard key={review.id.toString()} review={review} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
