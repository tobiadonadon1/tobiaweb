import { after } from "next/server";

/**
 * Run `task` after the response has gone (Next's after(), which Vercel keeps
 * alive until it finishes), so a slow sheet or beehiiv never holds up a
 * visitor. Outside a request (the tests call handlers directly) there is
 * nothing to run after, so run it now. A failing task is logged, never thrown.
 */
export async function later(task: () => Promise<unknown>): Promise<void> {
  const safe = async () => {
    try {
      await task();
    } catch (err) {
      console.error("[later] task failed", err);
    }
  };
  try {
    after(safe);
  } catch {
    await safe();
  }
}
