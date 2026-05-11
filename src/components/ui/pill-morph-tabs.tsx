"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export interface PillTab {
  value: string;
  label: React.ReactNode;
  panel?: React.ReactNode;
}

interface PillMorphTabsProps {
  items?: PillTab[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export default function PillMorphTabs({
  items = [
    { value: "overview", label: "Overview", panel: <div>Overview content</div> },
    { value: "features", label: "Features", panel: <div>Feature list</div> },
    { value: "pricing", label: "Pricing", panel: <div>Pricing & plans</div> },
    { value: "faq", label: "FAQ", panel: <div>FAQ content</div> },
  ],
  defaultValue,
  onValueChange,
  className,
}: PillMorphTabsProps) {
  const first = items[0]?.value ?? "tab-0";
  const [value, setValue] = React.useState<string>(defaultValue ?? first);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);
  const [isExpanding, setIsExpanding] = React.useState(false);

  const measure = React.useCallback(() => {
    const list = listRef.current;
    const activeEl = triggerRefs.current[value];
    if (!list || !activeEl) {
      setIndicator(null);
      return;
    }
    const listRect = list.getBoundingClientRect();
    const tRect = activeEl.getBoundingClientRect();
    setIndicator({
      left: tRect.left - listRect.left + list.scrollLeft,
      width: tRect.width,
    });
  }, [value]);

  React.useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    Object.values(triggerRefs.current).forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  React.useEffect(() => {
    setIsExpanding(true);
    const id = window.setTimeout(() => setIsExpanding(false), 300);
    return () => window.clearTimeout(id);
  }, [value]);

  React.useEffect(() => {
    if (onValueChange) onValueChange(value);
  }, [value, onValueChange]);

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={value} onValueChange={(v) => setValue(v)}>
        <div
          ref={listRef}
          className={cn(
            "relative",
            "inline-flex items-center gap-1 p-1 rounded-md",
            "bg-muted",
            "border border-border shadow-sm"
          )}
        >
          {indicator && (
            <motion.div
              layout
              initial={false}
              animate={{
                left: indicator.left,
                width: indicator.width,
                scaleY: isExpanding ? 1.05 : 1,
                borderRadius: 6, // rounded-md equivalent in pixels (approx)
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              className="absolute pointer-events-none top-1 bottom-1 bg-background shadow-sm border border-border"
              style={{
                left: indicator.left,
                width: indicator.width,
              }}
            />
          )}

          <TabsList className="relative flex gap-1 p-0 bg-transparent h-auto w-auto items-center justify-start border-0">
            {items.map((it) => {
              const isActive = it.value === value;
              return (
                <TabsTrigger
                  key={it.value}
                  value={it.value}
                  ref={(el: HTMLButtonElement | null) => {
                    if (el) triggerRefs.current[it.value] = el;
                  }}
                  className={cn(
                    "relative z-10 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {it.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="mt-4">
          {items.map((it) => (
            <TabsContent key={it.value} value={it.value} className="m-0 p-0 border-0 outline-none">
              {it.panel ?? null}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
