// app/agents/[slug]/chat/AgentChat.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

type AgentKey = "max" | "lea" | "jules" | "mia" | "chris";
type Msg = { role: "user" | "assistant"; content: string };

const TITLES: Record<AgentKey, string> = {
  max: "Max — CRM & Relances",
  lea: "Léa — Service client",
  jules: "Jules — Reporting",
  mia: "Mia — Premier contact",
  chris: "Chris — Support interne",
};

export default function AgentChat({ agent }: { agent: AgentKey }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const storeKey = (k: string) => `aziome_pagechat_${k}_${agent}`;

  // restore historique / thread
  useEffect(() => {
    try {
      const m = localStorage.getItem(storeKey("msgs"));
      const t = localStorage.getItem(storeKey("thread"));
      if (m) setMsgs(JSON.parse(m));
      if (t) setThreadId(t);
    } catch {}
  }, [agent]);

  // autoscroll
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  function persist(next: Msg[], t?: string | null) {
    try {
      localStorage.setItem(storeKey("msgs"), JSON.stringify(next));
      if (t !== undefined && t !== null) localStorage.setItem(storeKey("thread"), t);
    } catch {}
  }

  async function send() {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");

    const next = [...msgs, { role: "user", content: q } as Msg];
    setMsgs(next);
    persist(next);
    setLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, agent, threadId }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as { reply?: string; threadId?: string; error?: string };

      if (data.threadId && !threadId) setThreadId(data.threadId);

      const reply = data.reply ?? data.error ?? "Désolé, je n’arrive pas à répondre pour le moment.";
      const next2 = [...next, { role: "assistant", content: reply } as Msg];
      setMsgs(next2);
      persist(next2, data.threadId ?? null);
    } catch {
      const next2 = [...msgs, { role: "assistant", content: "Désolé, je n’arrive pas à répondre pour le moment." }];
      setMsgs(next2);
      persist(next2);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  return (
    <div className="mx-auto w-full max-w-2xl glass rounded-2xl p-4 md:p-6">
      <div className="mb-3 text-sm text-[color:var(--gold-2,#f5c66a)]">{TITLES[agent]}</div>

      <div ref={listRef} className="mb-3 h-[52vh] min-h-[320px] max-h-[60vh] overflow-y-auto space-y-3 pr-2">
        {msgs.length === 0 && (
          <p className="text-xs text-neutral-400">
            Dites-en un peu plus sur votre contexte (outils, volume, objectif) et je propose un plan simple.
          </p>
        )}
        {msgs.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm"
                : "max-w-[85%] rounded-xl border border-[color:var(--gold-2,#f5c66a)]/20 bg-neutral-950 px-3 py-2 text-sm"
            }
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="max-w-[85%] rounded-xl border border-[color:var(--gold-2,#f5c66a)]/20 bg-neutral-950 px-3 py-2 text-sm">
            …
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Écrivez votre message…"
          className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950
                     px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500
                     focus:outline-none focus:ring-1 focus:ring-[color:var(--gold-2,#f5c66a)]/50"
        />
        <button
          onClick={send}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium
                     text-black border border-[color:var(--gold-2,#f5c66a)]/30
                     bg-[#e6b34f] disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Envoyer
        </button>
      </div>
    </div>
  );
}
