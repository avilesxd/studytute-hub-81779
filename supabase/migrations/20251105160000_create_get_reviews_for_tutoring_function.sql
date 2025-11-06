CREATE OR REPLACE FUNCTION public.get_reviews_for_tutoring(
  p_tutoring_id uuid
)
RETURNS TABLE(
  id bigint,
  rating numeric(3, 1),
  comment text,
  created_at timestamp with time zone,
  user_name text,
  user_avatar_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.rating,
    r.comment,
    r.created_at,
    p.full_name,
    p.avatar_url
  FROM
    public.reviews r
  JOIN
    public.profiles p ON r.user_id = p.id
  WHERE
    r.tutoring_id = p_tutoring_id;
END;
$$ LANGUAGE plpgsql;
