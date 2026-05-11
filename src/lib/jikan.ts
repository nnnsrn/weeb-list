import type { MediaType } from "./media";

export interface JikanResult {
  mal_id: number;
  title: string;
  synopsis: string | null;
  images: { jpg: { large_image_url: string; image_url: string } };
  episodes?: number | null;
  chapters?: number | null;
  status?: string;
  genres: { name: string }[];
  type?: string;
  score?: number | null;
}

const BASE = "https://api.jikan.moe/v4";

export async function jikanSearch(type: MediaType, query: string): Promise<JikanResult[]> {
  if (!query.trim()) return [];
  // anime endpoint for anime; manga endpoint covers manga/manhwa/manhua via type filter
  if (type === "anime") {
    const r = await fetch(`${BASE}/anime?q=${encodeURIComponent(query)}&limit=12&sfw=true`);
    if (!r.ok) throw new Error("Jikan request failed");
    const json = await r.json();
    return json.data ?? [];
  }
  const filter = type === "manga" ? "manga" : type; // jikan supports manhwa, manhua
  const r = await fetch(
    `${BASE}/manga?q=${encodeURIComponent(query)}&limit=12&type=${filter}&sfw=true`
  );
  if (!r.ok) throw new Error("Jikan request failed");
  const json = await r.json();
  return json.data ?? [];
}

export function jikanToEntry(item: JikanResult, type: MediaType) {
  return {
    title: item.title,
    type,
    cover_image: item.images?.jpg?.large_image_url ?? item.images?.jpg?.image_url ?? null,
    synopsis: item.synopsis,
    total_units: type === "anime" ? item.episodes ?? null : item.chapters ?? null,
    genres: item.genres?.map((g) => g.name) ?? [],
    airing_status: item.status ?? null,
    external_id: String(item.mal_id),
    status: "planned" as const,
    current_progress: 0,
    rating: null,
    notes: null,
    start_date: null,
    finish_date: null,
    is_favorite: false,
  };
}
