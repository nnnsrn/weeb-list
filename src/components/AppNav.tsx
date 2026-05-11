import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Library, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/library", label: "Library", icon: Library },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/discover", label: "Discover", icon: Sparkles },
];

export function AppNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col gap-8 px-5 py-8 glass-strong border-r border-border z-30">
      <Link to="/" className="flex items-center gap-3">
        <img src="/logo-icon.png" alt="NinaList" className="h-10 w-10 rounded-xl object-cover shadow-glow" />
        <div className="leading-tight">
          <p className="text-base font-semibold gradient-text">NinaList</p>
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Ocean of stories</p>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                "hover:bg-white/5 hover:translate-x-0.5",
                active
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-glow"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl glass p-3 text-xs text-muted-foreground">
        Personal tracker · v1
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-30 glass-strong rounded-2xl px-2 py-2 flex items-center justify-around shadow-deep">
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(item.to + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
