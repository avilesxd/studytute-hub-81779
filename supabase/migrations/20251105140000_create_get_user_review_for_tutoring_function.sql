CREATE OR REPLACE FUNCTION public.get_user_review_for_tutoring(
  p_tutoring_id uuid
)
RETURNS TABLE(id bigint, rating smallint, comment text) AS $$
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
