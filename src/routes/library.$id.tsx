import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash2, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MediaFormDialog } from "@/components/MediaFormDialog";
import {
  PROGRESS_NOUN,
  STATUS_LABEL,
  TYPE_LABEL,
  deleteEntry,
  fetchEntries,
  incrementProgress,
  updateEntry,
} from "@/lib/media";
import { toast } from "sonner";

export const Route = createFileRoute("/library/$id")({
  component: EntryDetail,
});

function EntryDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const all = useQuery({ queryKey: ["entries"], queryFn: fetchEntries });
  const entry = all.data?.find((e) => e.id === id);

  const inc = useMutation({
    mutationFn: () => incrementProgress(entry!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["entries"] }),
  });
  const fav = useMutation({
    mutationFn: () => updateEntry(entry!.id, { is_favorite: !entry!.is_favorite }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["entries"] }),
  });
  const del = useMutation({
    mutationFn: () => deleteEntry(id),
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["entries"] });
      navigate({ to: "/library" });
    },
  });

  if (all.isLoading)
    return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!entry)
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Entry not found.</p>
        <Link to="/library" className="underline">Back to library</Link>
      </div>
    );

  const pct =
    entry.total_units && entry.total_units > 0
      ? Math.min(100, (entry.current_progress / entry.total_units) * 100)
      : 0;

  return (
    <div className="px-5 md:px-10 py-8 md:py-12 max-w-5xl mx-auto space-y-6">
      <Link to="/library" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to library
      </Link>

      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <div className="glass rounded-2xl overflow-hidden shadow-deep">
          {entry.cover_image ? (
            <img src={entry.cover_image} alt={entry.title} className="w-full aspect-[2/3] object-cover" />
          ) : (
            <div className="w-full aspect-[2/3] grid place-items-center text-muted-foreground">No cover</div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <Badge className="glass border-primary/30">{TYPE_LABEL[entry.type]}</Badge>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold gradient-text text-glow">{entry.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {STATUS_LABEL[entry.status]}
              {entry.airing_status ? ` · ${entry.airing_status}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {entry.genres.map((g) => (
              <Badge key={g} variant="secondary">{g}</Badge>
            ))}
          </div>

          <div className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span>
                {entry.current_progress}
                {entry.total_units ? ` / ${entry.total_units}` : ""} {PROGRESS_NOUN[entry.type]}
              </span>
            </div>
            <Progress value={pct} className="h-2" />
            <div className="flex flex-wrap gap-2 pt-1">
              <Button variant="tide" onClick={() => inc.mutate()} disabled={inc.isPending}>
                +1 {PROGRESS_NOUN[entry.type]}
              </Button>
              <Button variant="glass" onClick={() => fav.mutate()}>
                <Heart className={`h-4 w-4 ${entry.is_favorite ? "fill-primary text-primary" : ""}`} />
                {entry.is_favorite ? "Favorited" : "Favorite"}
              </Button>
              <MediaFormDialog
                entry={entry}
                trigger={
                  <Button variant="glass">
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                }
              />
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  if (confirm("Delete this entry?")) del.mutate();
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <Stat label="Rating">
              {entry.rating != null ? (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-primary" /> {entry.rating}
                </span>
              ) : "—"}
            </Stat>
            <Stat label="Started">{entry.start_date ?? "—"}</Stat>
            <Stat label="Finished">{entry.finish_date ?? "—"}</Stat>
          </div>

          {entry.synopsis && (
            <div className="glass rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Synopsis</p>
              <p className="text-sm leading-relaxed whitespace-pre-line">{entry.synopsis}</p>
            </div>
          )}

          {entry.notes && (
            <div className="glass rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Notes</p>
              <p className="text-sm leading-relaxed whitespace-pre-line">{entry.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1">{children}</p>
    </div>
  );
}
