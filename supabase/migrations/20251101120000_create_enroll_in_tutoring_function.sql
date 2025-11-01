
CREATE OR REPLACE FUNCTION public.enroll_in_tutoring(
  p_tutoring_id UUID,
  p_user_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_available_spots INT;
  v_tutoring_owner_id UUID;
BEGIN
  -- Check if the user is the owner of the tutoring
  SELECT user_id INTO v_tutoring_owner_id
  FROM public.tutorings
  WHERE id = p_tutoring_id;

  IF v_tutoring_owner_id = p_user_id THEN
    RAISE EXCEPTION 'No puedes inscribirte en tu propia tutoría.';
  END IF;

  -- Check for available spots and lock the row
  SELECT available_spots INTO v_available_spots
  FROM public.tutorings
  WHERE id = p_tutoring_id
  FOR UPDATE;

  IF v_available_spots > 0 THEN
    -- Insert the new enrollment
    INSERT INTO public.tutoring_enrollments (tutoring_id, user_id)
    VALUES (p_tutoring_id, p_user_id);

    -- Decrement the available spots
    UPDATE public.tutorings
    SET available_spots = available_spots - 1
    WHERE id = p_tutoring_id;
  ELSE
    RAISE EXCEPTION 'No hay cupos disponibles para esta tutoría.';
  END IF;
END;
$$ LANGUAGE plpgsql;
