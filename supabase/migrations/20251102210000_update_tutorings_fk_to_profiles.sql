-- Drop the existing foreign key constraint on tutorings.user_id
-- The constraint name is inferred, it might need to be adjusted if it's different.
ALTER TABLE public.tutorings DROP CONSTRAINT IF EXISTS tutorings_user_id_fkey;

-- Add a new foreign key constraint from tutorings.user_id to profiles.id
ALTER TABLE public.tutorings
ADD CONSTRAINT tutorings_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
