import { createFileRoute } from '@tanstack/react-router'
import { FloatingHeader } from '@/components/ui/floating-header'
import InteractiveHoverCards from '@/components/ui/interactive-hover-cards'
import { SegmentedProgress } from '@/components/ui/progress-bar'
import PillMorphTabs from '@/components/ui/pill-morph-tabs'
import AnimatedText from '@/components/ui/animated-text'
import { Tv, BookOpen, Star, Sparkles, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})

const sampleHoverCards = [
  {
    id: 1,
    title: "One Piece",
    description: "Gol D. Roger was known as the 'Pirate King', the strongest and most infamous being to have sailed the Grand Line.",
    icon: <Sparkles className="w-5 h-5 text-blue-500" />,
    color: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    bgGradient: "",
    stats: [
      { label: "Episodes", value: "1100+" },
      { label: "Score", value: "8.7" }
    ],
    tags: ["Shounen", "Adventure", "Comedy"]
  },
  {
    id: 2,
    title: "Jujutsu Kaisen",
    description: "Idly indulging in baseless paranormal activities with the Occult Club, high schooler Yuuji Itadori spends his days at either the clubroom or the hospital.",
    icon: <Star className="w-5 h-5 text-purple-500" />,
    color: "bg-purple-500/10 border-purple-500/20 text-purple-500",
    bgGradient: "",
    stats: [
      { label: "Episodes", value: "47" },
      { label: "Score", value: "8.6" }
    ],
    tags: ["Action", "Dark Fantasy"]
  },
  {
    id: 3,
    title: "Solo Leveling",
    description: "Ten years ago, the Gate appeared and connected the real world with the realm of magic and monsters.",
    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    bgGradient: "",
    stats: [
      { label: "Chapters", value: "200" },
      { label: "Score", value: "8.9" }
    ],
    tags: ["Action", "Fantasy", "Manhwa"]
  }
];

function DemoPage() {
  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      <FloatingHeader />
      
      <main className="container mx-auto px-4 pt-24 space-y-24">
        {/* Animated Text Section */}
        <section className="space-y-4">
          <AnimatedText 
            text="Elevated UI Components" 
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
            animationType="words"
          />
          <AnimatedText 
            text="Experience the redesigned tracker aesthetics with premium animations." 
            className="text-lg md:text-xl text-muted-foreground"
            delay={0.5}
          />
        </section>

        {/* Morphing Tabs Section */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Pill Morph Tabs</h2>
            <p className="text-muted-foreground">Smooth animated tabs for category switching.</p>
          </div>
          <PillMorphTabs 
            items={[
              {
                value: "anime",
                label: <div className="flex items-center gap-2"><Tv className="w-4 h-4" /> Anime</div>,
                panel: <div className="p-6 rounded-md bg-card border border-border mt-4 h-40 flex items-center justify-center text-muted-foreground shadow-sm">Anime Content Area</div>
              },
              {
                value: "manga",
                label: <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Manga</div>,
                panel: <div className="p-6 rounded-md bg-card border border-border mt-4 h-40 flex items-center justify-center text-muted-foreground shadow-sm">Manga Content Area</div>
              },
              {
                value: "favorites",
                label: <div className="flex items-center gap-2"><Star className="w-4 h-4" /> Favorites</div>,
                panel: <div className="p-6 rounded-md bg-card border border-border mt-4 h-40 flex items-center justify-center text-muted-foreground shadow-sm">Favorites Content Area</div>
              }
            ]}
          />
        </section>

        {/* Segmented Progress Section */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Segmented Progress Bar</h2>
            <p className="text-muted-foreground">Interactive progress tracking for episodes and chapters.</p>
          </div>
          <div className="bg-card p-8 rounded-md max-w-xl border border-border shadow-sm">
            <SegmentedProgress value={65} segments={24} label="Season 1 Progress (16/24 ep)" showDemo={true} />
          </div>
        </section>

        {/* Interactive Cards Section */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Interactive Hover Cards</h2>
            <p className="text-muted-foreground">Dynamic presentation for your media library.</p>
          </div>
          <InteractiveHoverCards cards={sampleHoverCards} />
        </section>
        
      </main>
    </div>
  )
}
