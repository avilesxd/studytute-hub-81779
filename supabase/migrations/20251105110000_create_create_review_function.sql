CREATE OR REPLACE FUNCTION public.create_review(
  p_tutoring_id uuid,
  p_rating smallint,
  p_comment text
)
RETURNS void AS $$
DECLARE
  v_user_id uuid;
  is_enrolled boolean;
BEGIN
  -- Get the user ID from the session
  v_user_id := auth.uid();

  -- Check if the user is enrolled in the tutoring
  SELECT EXISTS (
    SELECT 1
    FROM public.tutoring_enrollments
    WHERE tutoring_id = p_tutoring_id AND user_id = v_user_id
  ) INTO is_enrolled;

  IF NOT is_enrolled THEN
    RAISE EXCEPTION 'You must be enrolled in the tutoring to leave a review.';
  END IF;

  -- Insert the new review
  INSERT INTO public.reviews (tutoring_id, user_id, rating, comment)
  VALUES (p_tutoring_id, v_user_id, p_rating, p_comment);
END;
$$ LANGUAGE plpgsql;
