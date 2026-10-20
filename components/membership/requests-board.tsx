"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { ChevronUp, LoaderCircle } from "lucide-react";

/**
 * THE REQUESTS BOARD, for Ultimate members: ask for a skill, vote on the
 * ones others asked for. Most votes first. Tobia moves a request along
 * (planned, building, shipped, declined) in the database; the board shows it.
 * A member can take back their own while it's still open. All of it goes
 * through /api/membership/requests, which checks the plan.
 */

type Request = {
  id: number;
  title: string;
  details: string | null;
  status: "open" | "planned" | "building" | "shipped" | "declined";
  votes: number;
  voted: boolean;
  yours: boolean;
};

const STATUS: Record<Request["status"], string> = {
  open: "",
  planned: "Planned",
  building: "Building",
  shipped: "Shipped",
  declined: "Not this one",
};

const ERRORS: Record<string, string> = {
  "bad-title": "Give it a short title, 3 to 120 characters.",
  limit: "That's three requests this month. Vote on the others for now.",
};

const soft = "text-[color:rgba(11,31,58,0.68)]";
const field =
  "w-full rounded-xl border border-[var(--hairline-strong)] bg-white px-4 py-3 text-[1rem] text-[var(--ink)] outline-none transition-colors focus:border-[color:rgba(11,31,58,0.55)]";

async function post(body: Record<string, unknown>) {
  const res = await fetch("/api/membership/requests", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  return ((await res?.json().catch(() => null)) ?? { ok: false }) as { ok?: boolean; error?: string };
}

export function RequestsBoard() {
  const ids = useId();
  const [requests, setRequests] = useState<Request[] | null>(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    const r = await fetch("/api/membership/requests", { cache: "no-store", credentials: "same-origin" })
      .then((res) => res.json())
      .catch(() => null);
    // A failed read says so: an empty board would read as "nobody asked yet".
    if (r?.ok) setRequests(r.requests);
    else setFailed(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const vote = async (req: Request) => {
    // Shown at once; put back if the server says no.
    const flip = (r: Request) =>
      r.id === req.id ? { ...r, voted: !req.voted, votes: r.votes + (req.voted ? -1 : 1) } : r;
    setRequests((all) => all?.map(flip) ?? all);
    const r = await post({ action: req.voted ? "unvote" : "vote", id: req.id });
    if (!r.ok) setRequests((all) => all?.map((x) => (x.id === req.id ? req : x)) ?? all);
  };

  const remove = async (req: Request) => {
    setRequests((all) => all?.filter((x) => x.id !== req.id) ?? all);
    const r = await post({ action: "delete", id: req.id });
    if (!r.ok) load();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const r = await post({ action: "create", title, details });
    setBusy(false);
    if (!r.ok) return setError(ERRORS[r.error ?? ""] ?? "It didn't save. Try again in a minute.");
    setTitle("");
    setDetails("");
    load();
  };

  return (
    <section aria-labelledby={`${ids}-h`}>
      <h2 id={`${ids}-h`} className="font-serif text-[1.9rem] leading-none tracking-[-0.03em]">
        What I build next
      </h2>
      <p className={`mt-3 text-[1rem] leading-[1.5] ${soft}`}>
        Ask for a skill, or vote for one someone else asked for. I build from the top.
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3" noValidate>
        <label htmlFor={`${ids}-title`} className="sr-only">
          The skill you want
        </label>
        <input
          id={`${ids}-title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="A skill that…"
          className={field}
        />
        {title.trim().length >= 3 ? (
          <>
            <label htmlFor={`${ids}-details`} className="sr-only">
              Details (optional)
            </label>
            <textarea
              id={`${ids}-details`}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="What it should do, and why it would help you (optional)"
              className={`${field} resize-y`}
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[var(--ink)] px-6 py-3 text-[1rem] font-medium text-[var(--paper)] transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
            >
              {busy ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : null}
              Ask for it
            </button>
          </>
        ) : null}
        <p role="alert" className="min-h-[1.3em] text-[0.95rem] text-[var(--accent-clay-text)]">
          {error}
        </p>
      </form>

      {failed ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--hairline-strong)] bg-white p-5">
          <p className="text-[1rem]">The requests didn&rsquo;t load.</p>
          <button
            type="button"
            onClick={load}
            className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-[0.95rem] font-medium text-[var(--paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            Try again
          </button>
        </div>
      ) : requests === null ? (
        <div className="h-24" aria-busy="true" />
      ) : requests.length === 0 ? (
        <p className={`text-[1rem] ${soft}`}>Nothing asked yet. Be the first.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {requests.map((r) => (
            <li
              key={r.id}
              className={`flex gap-4 rounded-2xl border border-[var(--hairline-strong)] bg-white p-4 ${
                r.status === "declined" ? "opacity-60" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => vote(r)}
                aria-pressed={r.voted}
                aria-label={`${r.voted ? "Remove your vote for" : "Vote for"} ${r.title}`}
                className={`flex h-14 w-12 flex-none flex-col items-center justify-center rounded-xl border text-[0.95rem] font-medium tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
                  r.voted
                    ? "border-[var(--accent-clay-text)] bg-[var(--accent-clay-text)] text-[var(--paper)]"
                    : "border-[var(--hairline-strong)] text-[var(--ink)] hover:border-[var(--ink)]"
                }`}
              >
                <ChevronUp aria-hidden className="h-4 w-4" />
                {r.votes}
              </button>
              <div className="min-w-0">
                <p className="text-[1.02rem] font-medium leading-[1.35]">
                  {r.title}
                  {STATUS[r.status] ? (
                    <span className="ml-2 inline-block rounded-full bg-[rgba(11,31,58,0.07)] px-2.5 py-0.5 align-[0.1em] text-[0.78rem] font-normal">
                      {STATUS[r.status]}
                    </span>
                  ) : null}
                </p>
                {r.details ? (
                  <p className={`mt-1 whitespace-pre-line text-[0.92rem] leading-[1.45] ${soft}`}>{r.details}</p>
                ) : null}
                {r.yours ? (
                  <p className={`mt-1 text-[0.82rem] ${soft}`}>
                    Yours
                    {r.status === "open" ? (
                      <>
                        <span aria-hidden> · </span>
                        <button
                          type="button"
                          onClick={() => remove(r)}
                          aria-label={`Remove your request ${r.title}`}
                          className="underline underline-offset-2 hover:text-[var(--ink)]"
                        >
                          Remove
                        </button>
                      </>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
