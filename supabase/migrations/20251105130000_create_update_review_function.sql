CREATE OR REPLACE FUNCTION public.update_review(
  p_review_id bigint,
  p_rating smallint,
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
