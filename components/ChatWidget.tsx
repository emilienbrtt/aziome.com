"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  // <- La fenêtre n'est PAS ouverte au chargement
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // fait défiler vers le bas quand un nouveau message arrive
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
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
        body: JSON.stringify({
          messages: [...msgs, { role: "user", content: question }],
        }),
      });

      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      // L’API doit renvoyer { reply: "..." }
      const { reply } = await r.json();
      setMsgs((m) => [...m, { role: "assistant", content: reply ?? "" }]);
    } catch (e) {
      // Message d’erreur lisible si l’API plante
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Désolé, je n’arrive pas à répondre pour le moment. Réessaie dans un instant.",
        },
      ]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  return (
    <>
      {/* --- Bulle flottante (visible quand la fenêtre est fermée) --- */}
      {!open && (
        <button
          aria-label="Ouvrir le chat"
          onClick={() => setOpen(true)}
          className="
            fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full
            border border-[color:var(--gold-2,#f5c66a)]/30
            bg-[color:var(--gold-2,#f5c66a)] text-black
            shadow-lg transition hover:bg-[color:var(--gold-1,#ffd37a)]
          "
        >
          <MessageCircle className="mx-auto h-6 w-6" />
        </button>
      )}

      {/* --- Fenêtre du chat --- */}
      {open && (
        <div
          className="
            fixed right-6 bottom-6 z-50 w-[360px] max-w-[92vw]
            rounded-2xl border border-[color:var(--gold-2,#f5c66a)]/25
            bg-black/80 backdrop-blur p-4 shadow-2xl
          "
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-[color:var(--gold-2,#f5c66a)]">
              Aziome Assistant
            </h4>
            <button
              aria-label="Fermer le chat"
              onClick={() => setOpen(false)} // <- on ferme, mais la bulle reste
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
                bg-[color:var(--gold-2,#f5c66a)] hover:bg-[color:var(--gold-1,#ffd37a)]
                disabled:opacity-50
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
