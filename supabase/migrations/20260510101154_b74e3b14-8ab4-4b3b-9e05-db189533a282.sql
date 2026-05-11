
-- Enums
CREATE TYPE public.media_type AS ENUM ('anime', 'manga', 'manhwa', 'manhua');
CREATE TYPE public.media_status AS ENUM ('watching', 'reading', 'completed', 'on_hold', 'dropped', 'planned');

-- Main media entries table
CREATE TABLE public.media_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  cover_image TEXT,
  type public.media_type NOT NULL,
  status public.media_status NOT NULL DEFAULT 'planned',
  current_progress INTEGER NOT NULL DEFAULT 0,
  total_units INTEGER,
  rating NUMERIC(3,1),
  genres TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  synopsis TEXT,
  start_date DATE,
  finish_date DATE,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  external_id TEXT,
  airing_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_entries_type ON public.media_entries(type);
CREATE INDEX idx_media_entries_status ON public.media_entries(status);
CREATE INDEX idx_media_entries_updated ON public.media_entries(updated_at DESC);

-- Progress log
CREATE TABLE public.progress_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID NOT NULL REFERENCES public.media_entries(id) ON DELETE CASCADE,
  progress_value INTEGER NOT NULL,
  delta INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_progress_logs_media ON public.progress_logs(media_id);
CREATE INDEX idx_progress_logs_created ON public.progress_logs(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_media_entries_updated
BEFORE UPDATE ON public.media_entries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: single-user personal tracker, allow anon full access
ALTER TABLE public.media_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access to media" ON public.media_entries
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public full access to progress" ON public.progress_logs
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
