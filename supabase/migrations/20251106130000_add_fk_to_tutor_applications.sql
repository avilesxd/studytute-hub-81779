ALTER TABLE public.tutor_applications
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id)
REFERENCES public.profiles(id);