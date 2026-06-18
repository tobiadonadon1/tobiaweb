"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

// Stagger the children in as the grid scrolls into view.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 14,
    },
  },
};

interface BentoGridShowcaseProps {
  /** Tall card (spans 3 rows, left column). */
  integration: React.ReactNode;
  /** Top-middle card. */
  trackers: React.ReactNode;
  /** Top-right card. */
  statistic: React.ReactNode;
  /** Middle-middle card. */
  focus: React.ReactNode;
  /** Middle-right card. */
  productivity: React.ReactNode;
  /** Wide bottom card (spans 2 cols). */
  shortcuts: React.ReactNode;
  className?: string;
}

/**
 * Responsive 6-slot bento (the "Product Features" layout): a tall left card,
 * four cells, and a wide bottom card — staggered in on scroll. Each slot is a
 * content node, so the caller owns the card styling.
 */
export const BentoGridShowcase = ({
  integration,
  trackers,
  statistic,
  focus,
  productivity,
  shortcuts,
  className,
}: BentoGridShowcaseProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12%" }}
      className={cn(
        "grid w-full grid-cols-1 gap-4 md:grid-cols-3",
        "md:grid-rows-3",
        "auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-3">
        {integration}
      </motion.div>
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {trackers}
      </motion.div>
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {statistic}
      </motion.div>
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {focus}
      </motion.div>
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {productivity}
      </motion.div>
      <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1">
        {shortcuts}
      </motion.div>
    </motion.div>
  );
};
