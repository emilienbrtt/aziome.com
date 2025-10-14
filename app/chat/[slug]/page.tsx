// /app/chat/[slug]/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AgentKey } from "../../../config";
import { AGENTS } from "../../../config";

type Msg = { role: "user" | "assistant"; content: string };
const VALID: AgentKey[] = ["max", "lea", "jules", "mia", "chris"];

export default function ChatPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = (params.slug?.toLowerCase() ?? "") as AgentKey;
  if (!VALID.includes(slug)) router.push("/"); // fallback

  const header = AGENTS[slug].name;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const storeKey = (s: string) => `aziome_full_${s}_${slug}`;

  useEffect(() => {
    try {
      const id = localStorage.getItem(storeKey("thread"));
      const hist = localStorage.getItem(storeKey("msgs"));
      if (id) setThreadId(id);
      if (hist) setMsgs(JSON.parse(hist));
    } catch {}
  }, [slug]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  function save(next: Msg[], id?: string | null) {
    try {
      localStorage.setItem(storeKey("msgs"), JSON.stringify(next));
      if (id) localStorage.setItem(storeKey("thread"), id);
    } catch {}
  }

  async function send() {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    const next = [...msgs, { role: "user", content: question } as Msg];
    setMsgs(next);
    save(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          agent: slug,
          threadId,
          history: next.slice(-8),
          // context: "Tu peux envoyer ici des infos de page si besoin."
        }),
      });
      const data = await res.json();
      const reply = data?.reply ?? "…";
      if (data?.threadId && !threadId) setThreadId(data.threadId);
      const next2 = [...next, { role: "assistant", content: reply } as Msg];
      setMsgs(next2);
      save(next2, data?.threadId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[100svh] max-w-3xl mx-auto px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{header}</h1>
        <button onClick={()=>router.back()} className="text-sm text-[color:var(--gold-1)] hover:opacity-80">← Retour</button>
      </header>

      <div ref={listRef} className="h-[70svh] overflow-y-auto rounded-2xl border border-white/10 p-4 space-y-3 bg-black/40">
        {msgs.length === 0 && (
          <p className="text-sm text-neutral-400">
            Démarre une discussion dédiée à <b>{header}</b>. Pose ta question.
          </p>
        )}
        {msgs.map((m,i)=>(
          <div key={i} className={m.role==='user'?'text-right':''}>
            <div className={`inline-block max-w-[85%] px-3 py-2 rounded-xl ${m.role==='user'?'bg-white/10':'bg-white/5'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="inline-block px-3 py-2 rounded-xl bg-white/5">…</div>}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') send(); }}
          placeholder={`Écris à ${header.split(" — ")[0]}…`}
          className="flex-1 rounded-xl border border-white/10 bg-black/60 px-3 py-2 outline-none"
        />
        <button onClick={send} disabled={loading} className="rounded-xl px-3 py-2 bg-[color:var(--gold-1)] text-black disabled:opacity-50">Envoyer</button>
      </div>
    </section>
  );
}
