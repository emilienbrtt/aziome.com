// components/ChatWidget.tsx
"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    // 1) on ajoute le message utilisateur + le placeholder assistant "…"
    const user: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, user, { role: "assistant", content: "…" }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, user].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        // on lit le message d'erreur s'il existe
        let errText = "Erreur serveur.";
        try {
          const j = await res.json();
          if (j?.error) errText = j.error;
        } catch {}
        replaceLastAssistant(`Désolé, je rencontre un souci (${errText}).`);
        return;
      }

      const data = (await res.json()) as { reply?: string };
      const reply = data?.reply?.trim();
      if (!reply) {
        replaceLastAssistant("Désolé, je n’ai pas de réponse pour l’instant.");
      } else {
        replaceLastAssistant(reply);
      }
    } catch (err: any) {
      replaceLastAssistant(
        "Désolé, je n’arrive pas à contacter le serveur. Réessaie dans un instant."
      );
    } finally {
      setSending(false);
    }
  }

  // remplace le dernier message assistant (le placeholder "…")
  function replaceLastAssistant(text: string) {
    setMessages((prev) => {
      const copy = [...prev];
      // on cherche le dernier message assistant
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === "assistant") {
          copy[i] = { role: "assistant", content: text };
          return copy;
        }
      }
      // si on ne le trouve pas, on pousse quand même la réponse
      copy.push({ role: "assistant", content: text });
      return copy;
    });
  }

  // Styles brand (or) via variables CSS déjà présentes dans ton projet
  const goldBtn =
    "px-4 py-2 rounded-md font-medium text-black transition";
  const goldBtnStyle: React.CSSProperties = {
    background: "var(--gold-2)",
  };
  const goldBtnHover: React.CSSProperties = {
    background: "var(--gold-1)",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bouton fl ottant si tu veux pouvoir fermer/rouvrir */}
      {/* <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full w-12 h-12 shadow-lg border border-white/10"
        style={{ background: "radial-gradient(circle at 30% 30%, var(--gold-2), var(--gold-1))" }}
        aria-label="Ouvrir le chat"
      /> */}

      {open && (
        <div className="w-[340px] h-[480px] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="text-sm font-semibold">
              Aziome Assistant
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              Fermer
            </button>
          </div>

          {/* Zone messages */}
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-xl px-3 py-2 text-sm bg-neutral-800 text-neutral-100"
                    : "mr-auto max-w-[80%] rounded-xl px-3 py-2 text-sm bg-black/40 border border-white/10"
                }
              >
                {m.content}
              </div>
            ))}
          </div>

          {/* Zone input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-md bg-black/50 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                placeholder="Pose ta question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending}
                className={`${goldBtn} ${sending ? "opacity-60 cursor-not-allowed" : "hover:brightness-105"}`}
                style={goldBtnStyle}
                onMouseEnter={(e) =>
                  Object.assign((e.target as HTMLButtonElement).style, goldBtnHover)
                }
                onMouseLeave={(e) =>
                  Object.assign((e.target as HTMLButtonElement).style, goldBtnStyle)
                }
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
