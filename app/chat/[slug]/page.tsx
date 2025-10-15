// /app/chat/[slug]/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AgentKey } from "../../../config";
import { AGENTS } from "../../../config";

type Msg = { role: "user" | "assistant"; content: string };
const VALID: AgentKey[] = ["max", "lea", "jules", "mia", "chris"];

// on garde le chat éphémère (pas de persistance)
export default function ChatPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = (params.slug?.toLowerCase() ?? "") as AgentKey;

  useEffect(() => {
    if (!VALID.includes(slug)) router.replace("/");
  }, [slug, router]);

  // Nom court : on enlève tout éventuel “ — …”
  const agentName = (AGENTS[slug]?.name ?? "Agent").split(" — ")[0];

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");

    const next = [...msgs, { role: "user", content: q } as Msg];
    setMsgs(next);
    setLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          agent: slug,
          threadId,          // null au premier message → nouveau thread côté API
          history: next.slice(-8),
        }),
      });
      const data = await r.json();
      if (data?.threadId && !threadId) setThreadId(data.threadId);

      const reply = data?.reply ?? "…";
      setMsgs((m) => [...m, { role: "assistant", content: reply } as Msg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[100svh] max-w-2xl mx-auto px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{agentName}</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-[color:var(--gold-1)] hover:opacity-80"
        >
          ← Retour
        </button>
      </header>

      {/* cadre plus étroit */}
      <div className="mx-auto max-w-xl">
        <p className="mb-2 text-sm text-neutral-400">
          Pose une question à <b>{agentName}</b>.
        </p>

        <div
          ref={listRef}
          className="h-[58svh] md:h-[60svh] overflow-y-auto rounded-2xl border border-white/10 p-4 space-y-3 bg-black/40"
        >
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <div
                className={`inline-block max-w-[85%] px-3 py-2 rounded-xl ${
                  m.role === "user" ? "bg-white/10" : "bg-white/5"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="inline-block px-3 py-2 rounded-xl bg-white/5">…</div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Écris à ${agentName}…`}
            className="flex-1 rounded-xl border border-white/10 bg-black/60 px-3 py-2 outline-none"
          />
          <button
            onClick={send}
            disabled={loading}
            className="rounded-xl px-3 py-2 bg-[color:var(--gold-1)] text-black disabled:opacity-50"
          >
            Envoyer
          </button>
        </div>
      </div>
    </section>
  );
}
