-- Create get_enrolled_students_v2 function
CREATE OR REPLACE FUNCTION public.get_enrolled_students_v2(p_tutoring_id UUID)
RETURNS TABLE (full_name TEXT, email TEXT)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.full_name,
    u.email::text
  FROM
    public.tutoring_enrollments te
  JOIN
    auth.users u ON te.user_id = u.id
  JOIN
    public.profiles p ON te.user_id = p.id
  WHERE
    te.tutoring_id = p_tutoring_id;
END;
$$ LANGUAGE plpgsql;
