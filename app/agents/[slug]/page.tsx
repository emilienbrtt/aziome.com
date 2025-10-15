// /app/chat/[slug]/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type AgentKey = "max" | "lea" | "jules" | "mia" | "chris";
type Msg = { role: "user" | "assistant"; content: string };

const NAMES: Record<AgentKey, string> = {
  max: "Max",
  lea: "Léa",
  jules: "Jules",
  mia: "Mia",
  chris: "Chris",
};
const VALID: AgentKey[] = ["max", "lea", "jules", "mia", "chris"];

/** Nettoie le markdown pour un rendu plus naturel */
function cleanStreamChunk(raw: string): string {
  let s = raw;

  // Enlever gras/italique markdown
  s = s.replace(/\*\*(.*?)\*\*/g, "$1");
  s = s.replace(/\*(.*?)\*/g, "$1");
  s = s.replace(/_(.*?)_/g, "$1");
  // Titres / numérotations / puces
  s = s.replace(/^#{1,6}\s*/gm, "");
  s = s.replace(/^\s*[-•]\s+/gm, "");      // puces
  s = s.replace(/^\s*\d+\)\s+/gm, (m) => m.replace(")", ". ")); // 1) -> 1.
  // Blocs code
  s = s.replace(/```[\s\S]*?```/g, "");
  // Espaces multiples
  s = s.replace(/\n{3,}/g, "\n\n");

  return s;
}

export default function ChatPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = (params.slug?.toLowerCase() ?? "") as AgentKey;

  // si slug invalide -> retour accueil
  if (!VALID.includes(slug)) {
    if (typeof window !== "undefined") router.push("/");
  }

  const agentName = useMemo(() => NAMES[slug] ?? slug, [slug]);

  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [gotFirstChunk, setGotFirstChunk] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // Scroll auto vers le bas
  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, typing]);

  async function send() {
    const question = input.trim();
    if (!question || typing) return;

    setInput("");
    const history = [...msgs, { role: "user", content: question } as Msg];
    setMsgs(history);
    setTyping(true);
    setGotFirstChunk(false);

    const res = await fetch("/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: question,
        agent: slug,
        history: history.slice(-8),
      }),
    });

    const reader = res.body?.getReader();
    if (!reader) {
      setTyping(false);
      return;
    }

    const decoder = new TextDecoder();
    let acc = "";
    let assistantStarted = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      if (!chunk) continue;

      // signale que le stream a commencé -> on masque "est en train d’écrire"
      if (!gotFirstChunk) setGotFirstChunk(true);

      acc += chunk;
      const cleaned = cleanStreamChunk(acc);

      setMsgs((prev) => {
        const copy = [...prev];
        if (!assistantStarted) {
          // insère le premier message assistant quand le 1er chunk arrive
          copy.push({ role: "assistant", content: cleaned });
          assistantStarted = true;
        } else {
          // met à jour le dernier message assistant
          copy[copy.length - 1] = { role: "assistant", content: cleaned };
        }
        return copy;
      });
    }

    setTyping(false);
  }

  return (
    <section className="min-h-[100svh] max-w-3xl mx-auto px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{agentName}</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-[color:var(--gold-1)] hover:opacity-80"
        >
          ← Retour
        </button>
      </header>

      <div
        ref={scroller}
        className="h-[65svh] overflow-y-auto rounded-2xl border border-white/10 p-4 space-y-3 bg-black/40"
      >
        {msgs.length === 0 && (
          <p className="text-sm text-neutral-400">
            Pose une question à <b>{agentName}</b>. Réponse courte et naturelle.
          </p>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            {m.content && (
              <div
                className={`inline-block max-w-[85%] px-3 py-2 rounded-xl ${
                  m.role === "user" ? "bg-white/10" : "bg-white/5"
                }`}
              >
                {m.content}
              </div>
            )}
          </div>
        ))}

        {/* Indicateur de frappe AVANT le 1er chunk */}
        {typing && !gotFirstChunk && (
          <div className="text-xs text-neutral-400">{agentName} est en train d’écrire…</div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder={`Écris à ${agentName}…`}
          className="flex-1 rounded-xl border border-white/10 bg-black/60 px-3 py-2 outline-none"
        />
        <button
          onClick={send}
          disabled={typing || !input.trim()}
          className="rounded-xl px-3 py-2 bg-[color:var(--gold-1)] text-black disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </section>
  );
}
