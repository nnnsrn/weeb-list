
-- Roles
CREATE TYPE public.app_role AS ENUM ('owner');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roles are publicly readable"
  ON public.user_roles FOR SELECT
  USING (true);

-- has_role helper
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-assign first signup as owner
CREATE OR REPLACE FUNCTION public.assign_first_owner()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'owner');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_owner
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_first_owner();

-- Replace permissive RLS on media_entries
DROP POLICY IF EXISTS "Public full access to media" ON public.media_entries;

CREATE POLICY "Anyone can view media"
  ON public.media_entries FOR SELECT
  USING (true);

CREATE POLICY "Owner can insert media"
  ON public.media_entries FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owner can update media"
  ON public.media_entries FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owner can delete media"
  ON public.media_entries FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));

-- Same for progress_logs
DROP POLICY IF EXISTS "Public full access to progress" ON public.progress_logs;

CREATE POLICY "Anyone can view progress"
  ON public.progress_logs FOR SELECT
  USING (true);

CREATE POLICY "Owner can insert progress"
  ON public.progress_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owner can update progress"
  ON public.progress_logs FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owner can delete progress"
  ON public.progress_logs FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));
