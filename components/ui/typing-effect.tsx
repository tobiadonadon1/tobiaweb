"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

interface TypingEffectProps {
  texts?: string[];
  className?: string;
  rotationInterval?: number;
  typingSpeed?: number;
  /**
   * Vary the per-character delay like a real person typing: quick bursts,
   * brief hesitations, a beat at word breaks.
   */
  humanize?: boolean;
  /** Fires each time a text finishes typing out. */
  onComplete?: () => void;
  /** Override the cursor bar's classes (e.g. when the text fill is transparent). */
  cursorClassName?: string;
}

const DEMO = ["Design", "Development", "Marketing"];

export const TypingEffect = ({
  texts = DEMO,
  className,
  rotationInterval = 3000,
  typingSpeed = 150,
  humanize = false,
  onComplete,
  cursorClassName,
}: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedIndex = useRef(-1);
  const isInView = useInView(containerRef, { once: true });

  const currentText = texts[currentTextIndex % texts.length];

  useEffect(() => {
    if (!isInView) return;

    if (charIndex < currentText.length) {
      let delay = typingSpeed;
      if (humanize) {
        // Burst-and-hesitate rhythm instead of a metronome.
        delay = typingSpeed * (0.4 + Math.random() * 1.1);
        if (currentText.charAt(charIndex) === " ") delay *= 1.7;
        if (Math.random() < 0.1) delay += typingSpeed * 1.9;
      }
      const typingTimeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText.charAt(charIndex));
        setCharIndex(charIndex + 1);
      }, delay);
      return () => clearTimeout(typingTimeout);
    } else {
      if (completedIndex.current !== currentTextIndex) {
        completedIndex.current = currentTextIndex;
        onComplete?.();
      }
      const changeLabelTimeout = setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }, rotationInterval);
      return () => clearTimeout(changeLabelTimeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charIndex, currentText, isInView]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative inline-flex items-center justify-center text-center text-4xl font-bold",
        className
      )}
    >
      {displayedText}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "ml-1 h-[1em] w-1 rounded-sm bg-current",
          // Adjust cursor style as needed
          cursorClassName
        )}
      />
    </div>
  );
};

export default TypingEffect;
