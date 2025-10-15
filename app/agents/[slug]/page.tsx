// /app/chat/[slug]/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { role: "user" | "assistant"; content: string };
type AgentKey = "max" | "lea" | "jules" | "mia" | "chris";
const VALID: AgentKey[] = ["max", "lea", "jules", "mia", "chris"];

export default function ChatPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = (params.slug?.toLowerCase() ?? "") as AgentKey;
  if (!VALID.includes(slug)) router.push("/");

  const agentLabel: Record<AgentKey, string> = {
    max: "Max",
    lea: "Léa",
    jules: "Jules",
    mia: "Mia",
    chris: "Chris",
  };
  const header = `${agentLabel[slug]}`;

  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // À chaque navigation sur la page : on repart de zéro (pas de persistance)
  useEffect(() => {
    setMsgs([]);
  }, [slug]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, typing]);

  async function send() {
    const question = input.trim();
    if (!question || typing) return;

    // Ajoute le message utilisateur
    setMsgs((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setTyping(true);

    // Place un message assistant “vide” qu’on va remplir en streaming
    setMsgs((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          agent: slug,
          history: msgs.slice(-8),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const json = JSON.parse(data);
            const delta = json?.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              assistantText += delta;

              // met à jour le dernier message assistant
              setMsgs((prev) => {
                const copy = [...prev];
                // dernier index est l'assistant “vide”
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {
            // ignore lignes incomplètes
          }
        }
      }
    } catch (e) {
      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Désolé, je n’arrive pas à répondre pour le moment. On peut réessayer dans un instant.",
        };
        return copy;
      });
    } finally {
      setTyping(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  return (
    <section className="min-h-[100svh] max-w-2xl mx-auto px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{header}</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-[color:var(--gold-1)] hover:opacity-80"
        >
          ← Retour
        </button>
      </header>

      <p className="sr-only">Pose une question à {header}.</p>

      <div
        ref={listRef}
        className="h-[60svh] md:h-[64svh] overflow-y-auto rounded-2xl border border-white/10 p-4 space-y-3 bg-black/40"
      >
        {msgs.length === 0 && (
          <p className="text-sm text-neutral-400">
            Pose une question à <b>{header}</b>.
          </p>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div
              className={[
                "inline-block max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed",
                m.role === "user" ? "bg-white/10" : "bg-white/5",
              ].join(" ")}
            >
              {m.content}
            </div>
          </div>
        ))}

        {typing && (
          <div className="inline-block px-3 py-2 rounded-xl bg-white/5 text-sm text-neutral-400">
            {header} est en train d’écrire…
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={`Écris à ${header}…`}
          className="flex-1 rounded-xl border border-white/10 bg-black/60 px-3 py-2 outline-none"
        />
        <button
          onClick={send}
          disabled={typing}
          className="rounded-xl px-3 py-2 bg-[color:var(--gold-1)] text-black disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </section>
  );
}
