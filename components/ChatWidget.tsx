"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Msg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages.concat(userMsg) }),
      });

      const data = await res.json();
      const bot: Msg = { role: "assistant", content: data.reply || "…" };
      setMessages((m) => [...m, bot]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Désolé, une erreur est survenue." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-amber-500 text-black px-4 py-3 shadow-lg"
        aria-label="Ouvrir le chat"
      >
        {open ? "Fermer" : "Chat"}
      </button>

      {/* Fenêtre de chat */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 max-h-[70vh] rounded-xl border border-neutral-800 bg-black/90 backdrop-blur p-3 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed ${
                  m.role === "user" ? "text-right" : ""
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-2xl ${
                    m.role === "user"
                      ? "bg-amber-500/20 text-amber-100"
                      : "bg-neutral-800"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}

            {loading && (
              <div className="text-xs text-neutral-400">
                Aziome Assistant écrit…
              </div>
            )}
          </div>

          <div className="mt-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Pose ta question…"
              className="flex-1 rounded-lg bg-neutral-900 px-3 py-2 text-sm outline-none border border-neutral-800"
            />
            <button
              disabled={!input.trim() || loading}
              onClick={send}
              className="rounded-lg bg-amber-500 px-3 py-2 text-sm text-black disabled:opacity-50"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
