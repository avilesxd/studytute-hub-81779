-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('director', 'student');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create enum for tutoring status
CREATE TYPE public.tutoring_status AS ENUM ('pending', 'approved', 'rejected');

-- Create tutorings table
CREATE TABLE public.tutorings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  tutor_name TEXT NOT NULL,
  schedule TEXT NOT NULL,
  room TEXT NOT NULL,
  available_spots INTEGER NOT NULL CHECK (available_spots >= 0),
  total_spots INTEGER NOT NULL CHECK (total_spots > 0),
  price INTEGER NOT NULL CHECK (price >= 0),
  materials TEXT[] NOT NULL,
  topics TEXT[] NOT NULL,
  description TEXT,
  status tutoring_status DEFAULT 'pending' NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on tutorings
ALTER TABLE public.tutorings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved tutorings
CREATE POLICY "Anyone can view approved tutorings"
ON public.tutorings
FOR SELECT
USING (status = 'approved');

-- Policy: Directors can view all tutorings
CREATE POLICY "Directors can view all tutorings"
ON public.tutorings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'director'));

-- Policy: Students can insert their own tutorings
CREATE POLICY "Students can insert tutorings"
ON public.tutorings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Students can view their own tutorings
CREATE POLICY "Students can view their own tutorings"
ON public.tutorings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Directors can update any tutoring
CREATE POLICY "Directors can update tutorings"
ON public.tutorings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'director'))
WITH CHECK (public.has_role(auth.uid(), 'director'));

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Directors can view all roles
CREATE POLICY "Directors can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'director'));

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tutorings_updated_at
BEFORE UPDATE ON public.tutorings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();