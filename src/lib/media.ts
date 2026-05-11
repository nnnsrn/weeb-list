import { supabase } from "@/integrations/supabase/client";

export type MediaType = "anime" | "manga" | "manhwa" | "manhua";
export type MediaStatus =
  | "watching"
  | "reading"
  | "completed"
  | "on_hold"
  | "dropped"
  | "planned";

export interface MediaEntry {
  id: string;
  title: string;
  cover_image: string | null;
  type: MediaType;
  status: MediaStatus;
  current_progress: number;
  total_units: number | null;
  rating: number | null;
  genres: string[];
  notes: string | null;
  synopsis: string | null;
  start_date: string | null;
  finish_date: string | null;
  is_favorite: boolean;
  external_id: string | null;
  airing_status: string | null;
  created_at: string;
  updated_at: string;
}

export type NewMediaEntry = Omit<MediaEntry, "id" | "created_at" | "updated_at">;

export const STATUS_LABEL: Record<MediaStatus, string> = {
  watching: "Watching",
  reading: "Reading",
  completed: "Completed",
  on_hold: "On Hold",
  dropped: "Dropped",
  planned: "Planned",
};

export const TYPE_LABEL: Record<MediaType, string> = {
  anime: "Anime",
  manga: "Manga",
  manhwa: "Manhwa",
  manhua: "Manhua",
};

export const PROGRESS_NOUN: Record<MediaType, string> = {
  anime: "ep",
  manga: "ch",
  manhwa: "ch",
  manhua: "ch",
};

export async function fetchEntries(): Promise<MediaEntry[]> {
  const { data, error } = await supabase
    .from("media_entries")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MediaEntry[];
}

export async function createEntry(entry: Partial<NewMediaEntry> & { title: string; type: MediaType }) {
  const { data, error } = await supabase
    .from("media_entries")
    .insert(entry as never)
    .select()
    .single();
  if (error) throw error;
  return data as MediaEntry;
}

export async function updateEntry(id: string, patch: Partial<MediaEntry>) {
  const { data, error } = await supabase
    .from("media_entries")
    .update(patch as never)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as MediaEntry;
}

export async function deleteEntry(id: string) {
  const { error } = await supabase.from("media_entries").delete().eq("id", id);
  if (error) throw error;
}

export async function incrementProgress(entry: MediaEntry) {
  const next = entry.current_progress + 1;
  const patch: Partial<MediaEntry> = { current_progress: next };
  if (entry.total_units && next >= entry.total_units) {
    patch.status = "completed";
    patch.finish_date = new Date().toISOString().slice(0, 10);
  }
  const updated = await updateEntry(entry.id, patch);
  await supabase.from("progress_logs").insert({
    media_id: entry.id,
    progress_value: next,
    delta: 1,
  } as never);
  return updated;
}

export async function fetchActivity(limit = 30) {
  const { data, error } = await supabase
    .from("progress_logs")
    .select("id, media_id, progress_value, created_at, media_entries!inner(title, type, cover_image)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
