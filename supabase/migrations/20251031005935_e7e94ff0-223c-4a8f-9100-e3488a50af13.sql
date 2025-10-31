-- Create enum for tutor application status
CREATE TYPE public.tutor_application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create tutor_applications table
CREATE TABLE public.tutor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  experience TEXT NOT NULL,
  motivation TEXT NOT NULL,
  status tutor_application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.tutor_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Students can insert their own applications
CREATE POLICY "Students can insert tutor applications"
ON public.tutor_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own applications
CREATE POLICY "Users can view their own applications"
ON public.tutor_applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Directors can view all applications
CREATE POLICY "Directors can view all applications"
ON public.tutor_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'director'::app_role));

-- Policy: Directors can update applications
CREATE POLICY "Directors can update applications"
ON public.tutor_applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'director'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'director'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_tutor_applications_updated_at
BEFORE UPDATE ON public.tutor_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();