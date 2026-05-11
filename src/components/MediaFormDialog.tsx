import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jikanSearch, jikanToEntry } from "@/lib/jikan";
import {
  STATUS_LABEL,
  TYPE_LABEL,
  type MediaEntry,
  type MediaStatus,
  type MediaType,
  createEntry,
  updateEntry,
} from "@/lib/media";
import { toast } from "sonner";
import { Loader2, Search, Sparkles } from "lucide-react";

interface Props {
  trigger: React.ReactNode;
  entry?: MediaEntry;
}

const TYPES: MediaType[] = ["anime", "manga", "manhwa", "manhua"];
const STATUSES: MediaStatus[] = [
  "watching",
  "reading",
  "completed",
  "on_hold",
  "dropped",
  "planned",
];

export function MediaFormDialog({ trigger, entry }: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(entry ? "manual" : "search");

  // search state
  const [searchType, setSearchType] = useState<MediaType>("anime");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const search = useQuery({
    queryKey: ["jikan", searchType, submittedQuery],
    queryFn: () => jikanSearch(searchType, submittedQuery),
    enabled: !!submittedQuery,
  });

  // manual form
  const [form, setForm] = useState<Partial<MediaEntry>>(
    entry ?? { type: "anime", status: "planned", current_progress: 0, genres: [] }
  );

  const save = useMutation({
    mutationFn: async () => {
      if (entry) return updateEntry(entry.id, form);
      return createEntry({
        ...(form as Partial<MediaEntry>),
        title: form.title!,
        type: (form.type as MediaType) ?? "anime",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entries"] });
      toast.success(entry ? "Updated" : "Added to your library");
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const importFromJikan = useMutation({
    mutationFn: async (item: ReturnType<typeof jikanToEntry>) => createEntry(item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entries"] });
      toast.success("Imported");
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl glass-strong border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">
            {entry ? "Edit entry" : "Add to library"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          {!entry && (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> Import
              </TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
            </TabsList>
          )}

          {!entry && (
            <TabsContent value="search" className="space-y-3">
              <div className="flex gap-2">
                <Select
                  value={searchType}
                  onValueChange={(v) => setSearchType(v as MediaType)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {TYPE_LABEL[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search Jikan / MyAnimeList…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setSubmittedQuery(query)}
                />
                <Button onClick={() => setSubmittedQuery(query)} variant="tide">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                {search.isFetching && (
                  <div className="col-span-full grid place-items-center py-10 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
                {!search.isFetching && search.data?.length === 0 && submittedQuery && (
                  <p className="col-span-full text-center text-sm text-muted-foreground py-6">
                    Nothing found for “{submittedQuery}”.
                  </p>
                )}
                {search.data?.map((item) => (
                  <button
                    key={item.mal_id}
                    onClick={() => importFromJikan.mutate(jikanToEntry(item, searchType))}
                    disabled={importFromJikan.isPending}
                    className="group relative overflow-hidden rounded-xl glass text-left hover:shadow-glow transition-all"
                  >
                    <img
                      src={item.images.jpg.image_url}
                      alt={item.title}
                      className="aspect-[2/3] w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="p-2">
                      <p className="text-xs font-medium line-clamp-2">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {searchType === "anime"
                          ? `${item.episodes ?? "?"} ep`
                          : `${item.chapters ?? "?"} ch`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="manual" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title" className="col-span-2">
                <Input
                  value={form.title ?? ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </Field>
              <Field label="Cover image URL" className="col-span-2">
                <Input
                  value={form.cover_image ?? ""}
                  onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                />
              </Field>
              <Field label="Type">
                <Select
                  value={form.type ?? "anime"}
                  onValueChange={(v) => setForm({ ...form, type: v as MediaType })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{TYPE_LABEL[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Status">
                <Select
                  value={form.status ?? "planned"}
                  onValueChange={(v) => setForm({ ...form, status: v as MediaStatus })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Progress">
                <Input
                  type="number"
                  min={0}
                  value={form.current_progress ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, current_progress: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Total (episodes/chapters)">
                <Input
                  type="number"
                  min={0}
                  value={form.total_units ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      total_units: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </Field>
              <Field label="Rating (0–10)">
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  value={form.rating ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rating: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </Field>
              <Field label="Genres (comma-separated)" className="col-span-2">
                <Input
                  value={(form.genres ?? []).join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      genres: e.target.value
                        .split(",")
                        .map((g) => g.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>
              <Field label="Start date">
                <Input
                  type="date"
                  value={form.start_date ?? ""}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value || null })}
                />
              </Field>
              <Field label="Finish date">
                <Input
                  type="date"
                  value={form.finish_date ?? ""}
                  onChange={(e) => setForm({ ...form, finish_date: e.target.value || null })}
                />
              </Field>
              <Field label="Notes" className="col-span-2">
                <Textarea
                  rows={3}
                  value={form.notes ?? ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </Field>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="tide"
                onClick={() => {
                  if (!form.title) return toast.error("Title is required");
                  save.mutate();
                }}
                disabled={save.isPending}
              >
                {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {entry ? "Save changes" : "Add entry"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
