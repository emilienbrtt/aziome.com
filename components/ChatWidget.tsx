"use client";

import { useEffect, useRef, useState } from "react";
// Import en namespace pour éviter l'erreur de typings sur createPortal
import * as ReactDOM from "react-dom";
import { MessageCircle, Send, X } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Évite le mismatch SSR/CSR, et permet d'utiliser document.body
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Charger le threadId depuis le navigateur
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("aziome_thread_id") : null;
    if (saved) setThreadId(saved);
  }, []);

  // Sauvegarder dès qu’il change
  useEffect(() => {
    if (threadId) localStorage.setItem("aziome_thread_id", threadId);
  }, [threadId]);

  // Auto-hide du hint après 10s si la fenêtre est fermée
  useEffect(() => {
    if (!open && hintVisible) {
      const t = setTimeout(() => setHintVisible(false), 10000);
      return () => clearTimeout(t);
    }
  }, [open, hintVisible]);

  // Scroll au bas à chaque nouveau message
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const question = input.trim();

    setInput("");
    setMsgs((m) => [...m, { role: "user", content: question }]);
    setLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, threadId }),
      });

      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as { reply?: string; threadId?: string; error?: string };

      if (data.threadId && !threadId) setThreadId(data.threadId);

      const reply =
        data.reply ??
        data.error ??
        "Désolé, je n’arrive pas à répondre pour le moment. Réessaie dans un instant.";

      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error(e);
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Désolé, je n’arrive pas à répondre pour le moment. Réessaie dans un instant.",
        },
      ]);
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
  }

  // ----- UI (identique à la tienne), ancrée via portal pour rester toujours visible
  const ui = (
    <div
      className="fixed z-[9999]"
      style={{
        right: "max(1rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* Fermé : bulle + bouton rond */}
      {!open && (
        <div className="flex items-end gap-3">
          {hintVisible && (
            <button
              onClick={openChat}
              className="rounded-full border border-[color:var(--gold-2,#f5c66a)]/30
                         bg-black/70 px-3 py-1.5 text-xs text-[color:var(--gold-2,#f5c66a)]
                         shadow-lg backdrop-blur hover:bg-black/60 transition"
            >
              Besoin d’aide ?
            </button>
          )}
          <button
            aria-label="Ouvrir le chat"
            onClick={openChat}
            className="h-14 w-14 rounded-full border border-[color:var(--gold-2,#f5c66a)]/30
                       bg-[color:var(--gold-1,#ffd37a)] text-black shadow-[0_8px_30px_rgba(212,175,55,0.35)]
                       hover:shadow-[0_0_48px_rgba(212,175,55,0.35)] transition"
          >
            <MessageCircle className="mx-auto h-6 w-6" />
          </button>
        </div>
      )}

      {/* Ouvert : fenêtre */}
      {open && (
        <div
          className="w-[360px] max-w-[92vw] rounded-2xl border border-[color:var(--gold-2,#f5c66a)]/25
                     bg-black/80 backdrop-blur p-4 shadow-2xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-[color:var(--gold-2,#f5c66a)]">
              Aziome Assistant
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
                Pose-moi une question sur vos besoins (SAV, CRM, Reporting…).
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
              placeholder="Pose ta question…"
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
      )}
    </div>
  );

  // Utilise le portal sans dépendre des typings de react-dom
  return (ReactDOM as any).createPortal(ui, document.body);
}
