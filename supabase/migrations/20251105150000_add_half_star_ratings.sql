-- Alter the rating column to support decimal values
ALTER TABLE public.reviews
ALTER COLUMN rating TYPE numeric(3, 1);

-- Recreate the create_review function with the new rating type
DROP FUNCTION IF EXISTS public.create_review(p_tutoring_id uuid, p_rating smallint, p_comment text);
CREATE OR REPLACE FUNCTION public.create_review(
  p_tutoring_id uuid,
  p_rating numeric(3, 1),
  p_comment text
)
RETURNS void AS $$
DECLARE
  v_user_id uuid;
  is_enrolled boolean;
BEGIN
  v_user_id := auth.uid();

  SELECT EXISTS (
    SELECT 1
    FROM public.tutoring_enrollments
    WHERE tutoring_id = p_tutoring_id AND user_id = v_user_id
  ) INTO is_enrolled;

  IF NOT is_enrolled THEN
    RAISE EXCEPTION 'You must be enrolled in the tutoring to leave a review.';
  END IF;

  INSERT INTO public.reviews (tutoring_id, user_id, rating, comment)
  VALUES (p_tutoring_id, v_user_id, p_rating, p_comment);
END;
$$ LANGUAGE plpgsql;

-- Recreate the update_review function with the new rating type
DROP FUNCTION IF EXISTS public.update_review(p_review_id bigint, p_rating smallint, p_comment text);
CREATE OR REPLACE FUNCTION public.update_review(
  p_review_id bigint,
  p_rating numeric(3, 1),
  p_comment text
)
RETURNS void AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  UPDATE public.reviews
  SET
    rating = p_rating,
    comment = p_comment
  WHERE
    id = p_review_id AND user_id = v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Recreate the get_user_review_for_tutoring function with the new rating type
DROP FUNCTION IF EXISTS public.get_user_review_for_tutoring(p_tutoring_id uuid);
CREATE OR REPLACE FUNCTION public.get_user_review_for_tutoring(
  p_tutoring_id uuid
)
RETURNS TABLE(id bigint, rating numeric(3, 1), comment text) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.rating,
    r.comment
  FROM
    public.reviews r
  WHERE
    r.tutoring_id = p_tutoring_id AND r.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;

-- Also need to update the rating_check constraint
ALTER TABLE public.reviews
DROP CONSTRAINT IF EXISTS rating_check;

ALTER TABLE public.reviews
ADD CONSTRAINT rating_check CHECK ((rating >= 0.0) AND (rating <= 5.0));
