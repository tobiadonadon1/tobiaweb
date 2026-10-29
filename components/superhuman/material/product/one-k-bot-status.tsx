"use client";

import { useSyncExternalStore } from "react";

/**
 * WHERE THE CHALLENGE IS TODAY, in the visitor's own calendar: "Starts
 * tomorrow", "Day 4 of 10", "Ended". The server prints the dates, so the
 * line is right before the script runs and for anyone without it.
 */
const START = { y: 2026, m: 9, d: 30 }; // Friday 30 October 2026
const DAYS = 10;

function label(now: Date) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const day = Math.round((today - Date.UTC(START.y, START.m, START.d)) / 86_400_000) + 1;
  if (day > DAYS) return "The challenge has ended";
  if (day >= 1) return `Live · day ${day} of ${DAYS}`;
  if (day === 0) return "Starts tomorrow";
  return "Starts Friday, Oct 30";
}

const never = () => () => {};

export function ChallengeStatus() {
  return <>{useSyncExternalStore(never, () => label(new Date()), () => "Oct 30 → Nov 8")}</>;
}
