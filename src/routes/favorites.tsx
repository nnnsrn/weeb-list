import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MediaCard } from "@/components/MediaCard";
import { fetchEntries } from "@/lib/media";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [{ title: "Favorites — NinaList" }],
  }),
  component: Favorites,
});

function Favorites() {
  const entries = useQuery({ queryKey: ["entries"], queryFn: fetchEntries });
  const favs = (entries.data ?? []).filter((e) => e.is_favorite);

  return (
    <div className="px-5 md:px-10 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      <header className="animate-fade-in-up">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Pearls</p>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mt-2 inline-flex items-center gap-3">
          <Heart className="h-7 w-7 fill-primary text-primary" /> Favorites
        </h1>
      </header>

      {favs.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center text-muted-foreground">
          <p className="text-lg gradient-text mb-2">No favorites yet.</p>
          <p className="text-sm">Tap the heart on any card to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favs.map((e) => (
            <MediaCard key={e.id} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}
