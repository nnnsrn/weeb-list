import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type MediaEntry,
  PROGRESS_NOUN,
  STATUS_LABEL,
  TYPE_LABEL,
  incrementProgress,
  updateEntry,
} from "@/lib/media";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function MediaCard({ entry }: { entry: MediaEntry }) {
  const qc = useQueryClient();

  const inc = useMutation({
    mutationFn: () => incrementProgress(entry),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entries"] });
      qc.invalidateQueries({ queryKey: ["activity"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const fav = useMutation({
    mutationFn: () => updateEntry(entry.id, { is_favorite: !entry.is_favorite }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["entries"] }),
  });

  const pct =
    entry.total_units && entry.total_units > 0
      ? Math.min(100, (entry.current_progress / entry.total_units) * 100)
      : entry.current_progress > 0
      ? 12
      : 0;
      
  const segmentsCount = entry.total_units && entry.total_units > 0 && entry.total_units <= 24 ? entry.total_units : 12;

  return (
    <div className="group relative overflow-hidden rounded-md border border-border bg-card hover:bg-accent/10 hover:border-primary/50 transition-colors shadow-sm animate-fade-in-up flex flex-col h-full">
      <Link to="/library/$id" params={{ id: entry.id }} className="block">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          {entry.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.cover_image}
              alt={entry.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
              No cover
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <Badge className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm border-border text-foreground">
            {TYPE_LABEL[entry.type]}
          </Badge>
        </div>
      </Link>

      <button
        onClick={() => fav.mutate()}
        aria-label="Toggle favorite"
        className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-md bg-background/80 backdrop-blur-sm transition-colors hover:text-primary border border-border"
      >
        <Heart
          className={`h-4 w-4 ${entry.is_favorite ? "fill-primary text-primary" : "text-foreground"}`}
        />
      </button>

      <div className="relative -mt-6 px-3 pb-3 space-y-3 flex-1 flex flex-col justify-end">
        <div>
          <h3 className="line-clamp-1 text-sm font-semibold">{entry.title}</h3>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
            <span>{STATUS_LABEL[entry.status]}</span>
            <span>
              {entry.current_progress}
              {entry.total_units ? ` / ${entry.total_units}` : ""} {PROGRESS_NOUN[entry.type]}
            </span>
          </div>
        </div>
        
        <SegmentedProgress value={pct} segments={segmentsCount} showPercentage={false} className="py-1" />
        
        <div className="flex items-center gap-2 pt-1">
          {entry.rating != null && (
            <Badge variant="secondary" className="text-[10px]">★ {entry.rating}</Badge>
          )}
          <Button
            size="sm"
            variant="default"
            className="ml-auto h-7 px-3 text-[11px] font-semibold"
            onClick={() => inc.mutate()}
            disabled={inc.isPending}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
