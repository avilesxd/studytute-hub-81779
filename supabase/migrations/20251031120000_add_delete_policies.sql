-- Policy: Directors can delete tutorings
CREATE POLICY "Directors can delete tutorings"
ON public.tutorings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'director'));

-- Policy: Directors can delete tutor applications
CREATE POLICY "Directors can delete tutor applications"
ON public.tutor_applications
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'director'));
