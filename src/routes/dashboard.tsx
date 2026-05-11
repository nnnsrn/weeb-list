import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Activity, Flame, BookOpen, Tv, Pause, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaCard } from "@/components/MediaCard";
import { MediaFormDialog } from "@/components/MediaFormDialog";
import { fetchActivity, fetchEntries, type MediaEntry } from "@/lib/media";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NinaList" },
      { name: "description", content: "Your personal tracking dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const entries = useQuery({ queryKey: ["entries"], queryFn: fetchEntries });
  const activity = useQuery({ queryKey: ["activity"], queryFn: () => fetchActivity(15) });

  const data = entries.data ?? [];
  const stats = {
    completed: data.filter((e) => e.status === "completed").length,
    watching: data.filter((e) => e.status === "watching").length,
    reading: data.filter((e) => e.status === "reading").length,
    on_hold: data.filter((e) => e.status === "on_hold").length,
    dropped: data.filter((e) => e.status === "dropped").length,
  };

  const continueList = data
    .filter((e) => e.status === "watching" || e.status === "reading")
    .slice(0, 8);
  const recent = data.slice(0, 8);

  return (
    <div className="px-5 md:px-10 py-8 md:py-12 space-y-10 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Welcome back</p>
          <img src="/logo.png" alt="NinaList" className="h-16 sm:h-20 w-auto rounded-xl shadow-glow" />
        </div>
        <MediaFormDialog
          trigger={
            <Button variant="tide" size="lg">
              <Plus className="h-4 w-4" /> Add entry
            </Button>
          }
        />
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Completed" value={stats.completed} />
        <StatCard icon={<Tv className="h-4 w-4" />} label="Watching" value={stats.watching} />
        <StatCard icon={<BookOpen className="h-4 w-4" />} label="Reading" value={stats.reading} />
        <StatCard icon={<Pause className="h-4 w-4" />} label="On Hold" value={stats.on_hold} />
        <StatCard icon={<X className="h-4 w-4" />} label="Dropped" value={stats.dropped} />
      </section>

      <Section
        title="Continue your journey"
        icon={<Flame className="h-4 w-4 text-primary" />}
        empty={!continueList.length && "Nothing in progress yet — add something to start."}
      >
        <CardGrid items={continueList} />
      </Section>

      <Section
        title="Recently updated"
        icon={<Activity className="h-4 w-4 text-primary" />}
        empty={!recent.length && "Your library is empty. Add your first entry."}
      >
        <CardGrid items={recent} />
      </Section>

      <section>
        <h2 className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-4">
          Activity
        </h2>
        <div className="glass rounded-2xl p-4 space-y-2 max-h-80 overflow-y-auto">
          {activity.data?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No activity yet — hit the +1 button on any card.
            </p>
          )}
          {activity.data?.map((log) => {
            const m = (log as { media_entries: { title: string; type: string; cover_image: string | null } }).media_entries;
            return (
              <div key={log.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                {m?.cover_image && (
                  <img src={m.cover_image} alt="" className="h-10 w-8 rounded object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{m?.title ?? "Entry"}</p>
                  <p className="text-xs text-muted-foreground">
                    Progress {log.progress_value}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-4 transition-all hover:shadow-glow hover:-translate-y-0.5 animate-fade-in-up">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <p className="mt-2 text-3xl font-semibold gradient-text">{value}</p>
    </div>
  );
}

function Section({
  title,
  icon,
  empty,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  empty?: false | string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-muted-foreground mb-4">
        {icon} {title}
      </h2>
      {empty ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
          {empty}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

function CardGrid({ items }: { items: MediaEntry[] }) {
  if (!items.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((e) => (
        <MediaCard key={e.id} entry={e} />
      ))}
    </div>
  );
}
