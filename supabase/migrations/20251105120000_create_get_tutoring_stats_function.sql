CREATE OR REPLACE FUNCTION public.get_tutoring_stats(
  p_tutoring_id uuid
)
RETURNS TABLE(average_rating numeric, review_count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT
    AVG(rating)::numeric(2,1),
    COUNT(id)
  FROM
    public.reviews
  WHERE
    tutoring_id = p_tutoring_id;
END;
$$ LANGUAGE plpgsql;
