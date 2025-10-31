-- Create tutoring_enrollments table
CREATE TABLE public.tutoring_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tutoring_id UUID NOT NULL REFERENCES public.tutorings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (tutoring_id, user_id)
);

-- Enable RLS
ALTER TABLE public.tutoring_enrollments ENABLE ROW LEVEL SECURITY;

-- Policy: Students can insert their own enrollments
CREATE POLICY "Students can insert their own enrollments"
ON public.tutoring_enrollments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Students can view their own enrollments
CREATE POLICY "Students can view their own enrollments"
ON public.tutoring_enrollments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Directors can view all enrollments
CREATE POLICY "Directors can view all enrollments"
ON public.tutoring_enrollments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'director'));
