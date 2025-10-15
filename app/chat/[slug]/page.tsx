// /app/chat/[slug]/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type AgentKey = "max" | "lea" | "jules" | "mia" | "chris";
type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = (params.slug?.toLowerCase() ?? "") as AgentKey;

  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [gotFirstChunk, setGotFirstChunk] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  async function send() {
    const question = input.trim();
    if (!question || typing) return;

    setInput("");
    const history = [...msgs, { role: "user", content: question } as Msg];
    setMsgs(history);
    setTyping(true);
    setGotFirstChunk(false);

    // placeholder assistant (rempli par le stream)
    setMsgs(prev => [...prev, { role: "assistant", content: "" }]);

    const res = await fetch("/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question, agent: slug, history: history.slice(-8) }),
    });

    const reader = res.body?.getReader();
    if (!reader) { setTyping(false); return; }

    const decoder = new TextDecoder();
    let acc = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      if (chunk && !gotFirstChunk) setGotFirstChunk(true);
      acc += chunk;

      setMsgs(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: acc };
        return copy;
      });
    }

    setTyping(false);
  }

  return (
    <>
      {/* chat beaucoup plus étroit */}
      <section
        className="min-h-[100svh] w-full mx-auto px-4 py-6
                   max-w-[420px] sm:max-w-[460px] md:max-w-[500px]"
      >
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold capitalize">{slug}</h1>
          <button
            onClick={() => router.back()}
            className="text-sm text-[color:var(--gold-1)] hover:opacity-80"
          >
            ← Retour
          </button>
        </header>

        <div
          ref={scroller}
          className="h-[58svh] overflow-y-auto rounded-2xl border border-white/10 p-4 space-y-3 bg-black/40"
        >
          {msgs.length === 0 && (
            <p className="text-sm text-neutral-400">
              Pose une question à <b className="capitalize">{slug}</b>.
            </p>
          )}

          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <div
                className={`inline-block max-w-[88%] px-3 py-2 rounded-xl leading-relaxed ${
                  m.role === "user" ? "bg-white/10" : "bg-white/5"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* indicateur de frappe */}
          {typing && !gotFirstChunk && (
            <div className="text-xs text-neutral-400">… est en train d’écrire</div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder={`Écris à ${slug}…`}
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
    </>
  );
}
