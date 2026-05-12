import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jikanSearch, jikanToEntry } from "@/lib/jikan";
import { TYPE_LABEL, type MediaType, createEntry } from "@/lib/media";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/discover")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => ({
    meta: [
      { title: "Discover — NinaList" },
      { name: "description", content: "Search and import new titles into your library." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const qc = useQueryClient();
  const { isOwner } = useAuth();
  const search_params = Route.useSearch();
  const [type, setType] = useState<MediaType>("anime");
  const [q, setQ] = useState((search_params as { q?: string }).q ?? "");
  const [submitted, setSubmitted] = useState((search_params as { q?: string }).q ?? "");

  const search = useQuery({
    queryKey: ["jikan", type, submitted],
    queryFn: () => jikanSearch(type, submitted),
    enabled: !!submitted,
  });

  const add = useMutation({
    mutationFn: (item: ReturnType<typeof jikanToEntry>) => createEntry(item),
    onSuccess: () => {
      toast.success("Added to library");
      qc.invalidateQueries({ queryKey: ["entries"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="px-5 md:px-10 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      <header className="animate-fade-in-up">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Explore</p>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mt-2 inline-flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-primary" /> Discover
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Powered by Jikan / MyAnimeList — search and add in one tap.
        </p>
      </header>

      <div className="glass rounded-2xl p-4 space-y-4">
        <Tabs value={type} onValueChange={(v) => setType(v as MediaType)}>
          <TabsList className="grid grid-cols-4 w-full md:w-fit">
            {(["anime", "manga", "manhwa", "manhua"] as MediaType[]).map((t) => (
              <TabsTrigger key={t} value={t}>{TYPE_LABEL[t]}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${TYPE_LABEL[type].toLowerCase()}…`}
              className="pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSubmitted(q)}
            />
          </div>
          <Button variant="tide" onClick={() => setSubmitted(q)}>Search</Button>
        </div>
      </div>

      {search.isFetching && (
        <div className="grid place-items-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {!search.isFetching && submitted && search.data?.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
          Nothing surfaced for “{submitted}”.
        </div>
      )}

      {search.data && search.data.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {search.data.map((item) => (
            <div
              key={item.mal_id}
              className="group relative overflow-hidden rounded-2xl glass shadow-deep transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <img
                src={item.images.jpg.large_image_url ?? item.images.jpg.image_url}
                alt={item.title}
                className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-3 space-y-2">
                <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {type === "anime" ? `${item.episodes ?? "?"} ep` : `${item.chapters ?? "?"} ch`}
                  {item.score ? ` · ★ ${item.score}` : ""}
                </p>
                {isOwner ? (
                  <Button
                    size="sm"
                    variant="tide"
                    className="w-full h-8 text-xs"
                    onClick={() => add.mutate(jikanToEntry(item, type))}
                    disabled={add.isPending}
                  >
                    Add to library
                  </Button>
                ) : (
                  <p className="text-[10px] text-center text-muted-foreground italic">Sign in as owner to add</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!submitted && (
        <div className="glass rounded-2xl p-16 text-center text-muted-foreground">
          <p className="gradient-text text-lg mb-1">Cast your line.</p>
          <p className="text-sm">Search any title to begin.</p>
        </div>
      )}
    </div>
  );
}
