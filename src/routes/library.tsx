import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PillMorphTabsComponent from "@/components/ui/pill-morph-tabs"; // Import actual component
import { MediaCard } from "@/components/MediaCard";
import { MediaFormDialog } from "@/components/MediaFormDialog";
import {
  fetchEntries,
  STATUS_LABEL,
  TYPE_LABEL,
  type MediaStatus,
  type MediaType,
} from "@/lib/media";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — NinaList" },
      { name: "description", content: "Your full anime, manga, manhwa and manhua library." },
    ],
  }),
  component: LibraryPage,
});

type Sort = "updated" | "rating" | "title";

function LibraryPage() {
  const { isOwner } = useAuth();
  const entries = useQuery({ queryKey: ["entries"], queryFn: fetchEntries });
  const [type, setType] = useState<MediaType | "all">("all");
  const [status, setStatus] = useState<MediaStatus | "all">("all");
  const [sort, setSort] = useState<Sort>("updated");
  const [q, setQ] = useState("");
  const [minRating, setMinRating] = useState("0");

  const filtered = useMemo(() => {
    let list = entries.data ?? [];
    if (type !== "all") list = list.filter((e) => e.type === type);
    if (status !== "all") list = list.filter((e) => e.status === status);
    if (Number(minRating) > 0)
      list = list.filter((e) => (e.rating ?? 0) >= Number(minRating));
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(needle));
    }
    list = [...list].sort((a, b) => {
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "title") return a.title.localeCompare(b.title);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    return list;
  }, [entries.data, type, status, sort, q, minRating]);

  return (
    <div className="px-5 md:px-10 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Collection</p>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mt-2">Library</h1>
        </div>
        {isOwner && (
          <MediaFormDialog
            trigger={
              <Button variant="tide" size="lg">
                <Plus className="h-4 w-4" /> Add entry
              </Button>
            }
          />
        )}
      </header>

      <div className="bg-card border border-border rounded-md p-4 space-y-4 shadow-sm">
        <PillMorphTabsComponent
          defaultValue={type}
          onValueChange={(v) => setType(v as MediaType | "all")}
          items={[
            { value: "all", label: "All" },
            { value: "anime", label: TYPE_LABEL.anime },
            { value: "manga", label: TYPE_LABEL.manga },
            { value: "manhwa", label: TYPE_LABEL.manhwa },
            { value: "manhua", label: TYPE_LABEL.manhua },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your library…"
              className="pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as MediaStatus | "all")}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(Object.keys(STATUS_LABEL) as MediaStatus[]).map((s) => (
                <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="title">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Min rating</span>
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger className="w-24 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[0, 5, 6, 7, 8, 9].map((n) => (
                <SelectItem key={n} value={String(n)}>{n === 0 ? "Any" : `${n}+`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-auto">{filtered.length} result{filtered.length !== 1 && "s"}</span>
        </div>
      </div>

      {entries.isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl glass animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-muted rounded-md border border-border p-16 text-center text-muted-foreground">
          <p className="text-lg font-medium text-foreground mb-2">Calm waters here.</p>
          <p className="text-sm">Try adjusting your filters or add something new.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((e) => (
            <MediaCard key={e.id} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}
