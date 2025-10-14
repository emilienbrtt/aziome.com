"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type AgentKey = "max" | "lea" | "jules" | "mia" | "chris";
type Msg = { role: "user" | "assistant"; content: string };

const AGENT_TITLES: Record<AgentKey, string> = {
  max: "Max — CRM & Relances",
  lea: "Léa — Service client",
  jules: "Jules — Reporting",
  mia: "Mia — Premier contact",
  chris: "Chris — Support interne",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [agent, setAgent] = useState<AgentKey | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // ——— Utils
  const storeKey = (suffix: string) => `aziome_${suffix}_${agent ?? "default"}`;

  function loadThread() {
    if (typeof window === "undefined") return;
    try {
      const savedThread = localStorage.getItem(storeKey("thread_id"));
      const savedMsgs = localStorage.getItem(storeKey("msgs"));
      if (savedThread) setThreadId(savedThread);
      setMsgs(savedMsgs ? JSON.parse(savedMsgs) : []);
    } catch {
      setMsgs([]);
    }
  }

  function saveThread(nextMsgs?: Msg[], nextThreadId?: string | null) {
    try {
      if (nextMsgs) localStorage.setItem(storeKey("msgs"), JSON.stringify(nextMsgs));
      if (typeof nextThreadId !== "undefined" && nextThreadId)
        localStorage.setItem(storeKey("thread_id"), nextThreadId);
    } catch {}
  }

  // ——— Ouvrir via évènement global
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail as { agent?: AgentKey } | undefined;
      const a = detail?.agent ?? null;
      setAgent(a);
      setOpen(true);
      setHintVisible(false);
      setTimeout(loadThread, 0);
    };
    window.addEventListener("aziome:open-chat", onOpen as any);
    return () => window.removeEventListener("aziome:open-chat", onOpen as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ——— Ouvrir via ?chat=max
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const v = (url.searchParams.get("chat") || "").toLowerCase() as AgentKey;
    if (["max", "lea", "jules", "mia", "chris"].includes(v)) {
      setAgent(v);
      setOpen(true);
      setHintVisible(false);
      setTimeout(loadThread, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll auto
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const a = agent ?? "max"; // défaut
    const question = input.trim();
    setInput("");

    const nextMsgs = [...msgs, { role: "user", content: question } as Msg];
    setMsgs(nextMsgs);
    saveThread(nextMsgs);
    setLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          threadId,
          agent: a,                 // ← persona
          history: nextMsgs.slice(-6), // ← contexte court
        }),
      });

      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as { reply?: string; threadId?: string; error?: string };

      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
        saveThread(undefined, data.threadId);
      }

      const reply =
        data.reply ??
        data.error ??
        "Désolé, je n’arrive pas à répondre pour le moment. Réessaie dans un instant.";

      const next2 = [...nextMsgs, { role: "assistant", content: reply } as Msg];
      setMsgs(next2);
      saveThread(next2);
    } catch {
      const next2 = [
        ...msgs,
        { role: "assistant", content: "Désolé, je n’arrive pas à répondre pour le moment." },
      ] as Msg[];
      setMsgs(next2);
      saveThread(next2);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  function openChat() {
    setOpen(true);
    setHintVisible(false);
    if (!agent) setAgent("max"); // défaut
    setTimeout(loadThread, 0);
  }

  const header = agent ? (AGENT_TITLES[agent] ?? "Assistant") : "Assistant Aziome";

  return (
    <>
      {/* Onglet “Besoin d’aide ?” */}
      {!open && (
        <>
          {hintVisible && (
            <button
              onClick={openChat}
              className="
                fixed right-24 bottom-10 z-[2147483646]
                rounded-full border border-[color:var(--gold-2,#f5c66a)]/30
                bg-black/70 px-3 py-1.5 text-xs text-[color:var(--gold-2,#f5c66a)]
                shadow-lg backdrop-blur hover:bg-black/60 transition
              "
              style={{
                right: "max(6rem, env(safe-area-inset-right))",
                bottom: "max(2.5rem, env(safe-area-inset-bottom))",
              }}
            >
              Besoin d’aide ?
            </button>
          )}

          <button
            aria-label="Ouvrir le chat"
            onClick={openChat}
            className="
              fixed right-6 bottom-6 z-[2147483646]
              h-14 w-14 rounded-full
              border border-[color:var(--gold-2,#f5c66a)]/30
              bg-[color:var(--gold-1,#ffd37a)] text-black
              shadow-[0_8px_30px_rgba(212,175,55,0.35)]
              hover:shadow-[0_0_48px_rgba(212,175,55,0.35)] transition
            "
            style={{
              right: "max(1.5rem, env(safe-area-inset-right))",
              bottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
          >
            <MessageCircle className="mx-auto h-6 w-6" />
          </button>
        </>
      )}

      {/* Fenêtre */}
      {open && (
        <div
          className="
            fixed right-6 bottom-6 z-[2147483646]
            w-[360px] max-w-[92vw]
            rounded-2xl border border-[color:var(--gold-2,#f5c66a)]/25
            bg-black/80 backdrop-blur p-4 shadow-2xl
          "
          style={{
            right: "max(1.5rem, env(safe-area-inset-right))",
            bottom: "max(1.5rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-[color:var(--gold-2,#f5c66a)]">
              {header}
            </h4>
            <button
              aria-label="Fermer le chat"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-[color:var(--gold-2,#f5c66a)]/80 hover:text-[color:var(--gold-1,#ffd37a)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="mb-3 h-64 space-y-3 overflow-y-auto pr-2">
            {msgs.length === 0 && (
              <p className="text-xs text-neutral-400">
                Pose une question à {agent ? AGENT_TITLES[agent].split(" — ")[0] : "notre assistant"}…
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
              placeholder="Écris ton message…"
              className="
                flex-1 rounded-xl border border-neutral-800 bg-neutral-950
                px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500
                focus:outline-none focus:ring-1 focus:ring-[color:var(--gold-2,#f5c66a)]/50
              "
            />
            <button
              onClick={send}
              disabled={loading}
              className="
                inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium
                text-black border border-[color:var(--gold-2,#f5c66a)]/30
                bg-[#e6b34f] disabled:opacity-50
              "
            >
              <Send className="h-4 w-4" />
              Envoyer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
