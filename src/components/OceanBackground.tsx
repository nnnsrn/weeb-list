import { useMemo } from "react";

const CREATURES = ["🐠", "🐡", "🐟", "🦑", "🐙", "🦀", "🦞", "🐬", "🐳", "🦈", "🪼", "🐚", "⭐"];

export function OceanBackground({ density = 18 }: { density?: number }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => {
        const size = 6 + Math.random() * 28;
        return {
          key: i,
          style: {
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${10 + Math.random() * 18}s`,
            animationDelay: `${Math.random() * 12}s`,
          } as React.CSSProperties,
        };
      }),
    [density]
  );

  const creatures = useMemo(() => {
    const count = Math.max(6, Math.round(density / 2));
    return Array.from({ length: count }, (_, i) => {
      const fromLeft = Math.random() > 0.5;
      const size = 18 + Math.random() * 28;
      const duration = 28 + Math.random() * 32;
      return {
        key: i,
        emoji: CREATURES[Math.floor(Math.random() * CREATURES.length)],
        style: {
          top: `${5 + Math.random() * 85}%`,
          fontSize: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${-Math.random() * duration}s`,
        } as React.CSSProperties,
        className: fromLeft ? "sea-creature drift-right" : "sea-creature drift-left",
      };
    });
  }, [density]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{ backgroundImage: "var(--gradient-glow)" }}
      />
      {bubbles.map((b) => (
        <span key={b.key} className="bubble" style={b.style} />
      ))}
      {creatures.map((c) => (
        <span key={c.key} className={c.className} style={c.style}>
          <span className="sea-bob inline-block">{c.emoji}</span>
        </span>
      ))}
    </div>
  );
}
