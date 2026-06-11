"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  /** Notifies the parent on hover changes (e.g. so the hero can glow). */
  onHoverChange?: (hovered: boolean) => void;
}

/**
 * Completely neutral at rest. ONLY on hover does it acquire the colour:
 * a vivid electric blue→cyan (same family as the drifting aurora) with a
 * cyan glow. State-driven inline styles — no CSS variant can silently fail.
 */
export function ButtonColorful({
  className,
  label = "Explore Components",
  onHoverChange,
  ...props
}: ButtonColorfulProps) {
  const [hovered, setHovered] = useState(false);
  const setHover = (h: boolean) => {
    setHovered(h);
    onHoverChange?.(h);
  };

  return (
    <Button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "relative h-10 px-4 overflow-hidden border shadow-none",
        "transition-all duration-300",
        className
      )}
      style={{
        // Humble, sleek hover: a pale teal lift (Tobia's screenshot-approved
        // tone), whisper of glow — not a loud electric fill.
        backgroundColor: hovered ? "#cfe9ee" : "#f1ede4",
        borderColor: hovered ? "rgba(14,116,144,0.28)" : "rgba(0,0,0,0.08)",
        boxShadow: hovered
          ? "0 8px 24px rgba(14,116,144,0.22), 0 2px 8px rgba(14,116,144,0.12)"
          : "0 1px 4px rgba(20,20,20,0.06)",
      }}
      {...props}
    >
      {/* Soft cyan-teal glow — appears ONLY on hover, kept quiet */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-300 blur transition-opacity duration-500"
        style={{ opacity: hovered ? 0.28 : 0 }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span
          className="transition-colors duration-300"
          style={{ color: hovered ? "#083344" : "#1a1a1a" }}
        >
          {label}
        </span>
        <ArrowUpRight
          className="w-3.5 h-3.5 transition-colors duration-300"
          style={{
            color: hovered ? "rgba(8,51,68,0.85)" : "rgba(26,26,26,0.7)",
          }}
        />
      </div>
    </Button>
  );
}
