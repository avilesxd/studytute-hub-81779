-- Create get_enrolled_students function
CREATE OR REPLACE FUNCTION public.get_enrolled_students(p_tutoring_id UUID)
RETURNS TABLE (full_name TEXT, email TEXT)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.raw_user_meta_data->>'full_name' AS full_name,
    u.email
  FROM
    public.tutoring_enrollments te
  JOIN
    auth.users u ON te.user_id = u.id
  WHERE
    te.tutoring_id = p_tutoring_id;
END;
$$ LANGUAGE plpgsql;
