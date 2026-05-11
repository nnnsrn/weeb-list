import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Waves, ArrowRight, Library, TrendingUp } from "lucide-react";
import AnimatedText from "@/components/ui/animated-text";
import { InteractiveHoverCards, HoverCardData } from "@/components/ui/interactive-hover-cards";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NinaList — Dive into every story" },
      {
        name: "description",
        content:
          "Track every anime, manga, manhwa, and manhua journey in one personal ocean of stories.",
      },
    ],
  }),
  component: Landing,
});

const TRENDING: HoverCardData[] = [
  {
    id: 1,
    title: "Frieren: Beyond Journey's End",
    description: "An elf and her friends.",
    image: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
    tags: ["Anime", "Fantasy"],
    stats: [{ label: "Score", value: "9.3" }],
    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: 2,
    title: "Solo Leveling",
    description: "The weakest hunter of all mankind.",
    image: "https://cdn.myanimelist.net/images/manga/3/222295l.jpg",
    tags: ["Manhwa", "Action"],
    stats: [{ label: "Score", value: "8.9" }],
    icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
  },
  {
    id: 3,
    title: "Chainsaw Man",
    description: "A boy and his chainsaw dog.",
    image: "https://cdn.myanimelist.net/images/manga/3/216464l.jpg",
    tags: ["Manga", "Action"],
    stats: [{ label: "Score", value: "8.8" }],
    icon: <TrendingUp className="w-5 h-5 text-red-500" />,
  },
  {
    id: 4,
    title: "Jujutsu Kaisen",
    description: "A boy swallows a cursed finger.",
    image: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    tags: ["Anime", "Action"],
    stats: [{ label: "Score", value: "8.6" }],
    icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
  },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <section className="relative px-6 pt-24 pb-32 md:pt-36 md:pb-40 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground animate-fade-in-up">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Personal tracker · No account needed
        </div>

        <AnimatedText 
          text="Dive Into Every Story." 
          className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight"
          animationType="words"
        />

        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground animate-fade-in-up">
          Track every anime, manga, manhwa, and manhua journey in one personal ocean of stories.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3 animate-fade-in-up">
          <Button asChild variant="tide" size="xl" className="animate-pulse-glow">
            <Link to="/dashboard">
              <Waves className="h-4 w-4" /> Start Tracking <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="glass" size="xl">
            <Link to="/library">
              <Library className="h-4 w-4" /> View Collection
            </Link>
          </Button>
        </div>

        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/20 blur-[120px] -z-10" />
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Trending in the deep
        </h2>
        <InteractiveHoverCards cards={TRENDING} />
      </section>

      <footer className="px-6 pb-10 text-center text-xs text-muted-foreground">
        Crafted with deep-sea calm · NinaList
      </footer>
    </div>
  );
}
