'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';

type AgentKey = 'max' | 'lea' | 'jules' | 'mia' | 'chris';
type Role = 'user' | 'assistant';
type Msg = { role: Role; content: string };

const NAMES: Record<AgentKey, string> = {
  max: 'Max',
  lea: 'Léa',
  jules: 'Jules',
  mia: 'Mia',
  chris: 'Chris',
};

export default function AgentChat({ agent }: { agent: AgentKey }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll à chaque nouveau message
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [msgs, loading]);

  async function send() {
    const question = input.trim();
    if (!question || loading) return;

    setInput('');
    setMsgs((m) => [...m, { role: 'user' as const, content: question }]);
    setLoading(true);

    try {
      // Appel de ton API — on transmet l’agent
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, agent }),
      });

      let reply = "Je suis l'agent, comment puis-je aider ?";
      if (r.ok) {
        const data = (await r.json()) as { reply?: string; error?: string };
        reply = data.reply ?? data.error ?? reply;
      }

      setMsgs((m) => [...m, { role: 'assistant' as const, content: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: 'assistant' as const, content: "Désolé, je n'arrive pas à répondre pour le moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') send();
  }

  return (
    <div
      className="
        mx-auto w-full max-w-xl
        rounded-2xl border border-[color:var(--gold-2,#f5c66a)]/25
        bg-black/80 backdrop-blur p-4 shadow-2xl
      "
    >
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium text-[color:var(--gold-2,#f5c66a)]">
          Parler à l’agent {NAMES[agent]}
        </h4>
        <button
          aria-label="Vider la conversation"
          onClick={() => setMsgs([])}
          className="rounded-full p-1 text-[color:var(--gold-2,#f5c66a)]/80 hover:text-[color:var(--gold-1,#ffd37a)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={listRef} className="mb-3 h-64 space-y-3 overflow-y-auto pr-2">
        {msgs.length === 0 && (
          <p className="text-xs text-neutral-400">
            Posez votre première question à cet agent.
          </p>
        )}

        {msgs.map((m, i) => (
          <div
            key={i}
            className={
              m.role === 'user'
                ? 'ml-auto max-w-[85%] rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm'
                : 'max-w-[85%] rounded-xl border border-[color:var(--gold-2,#f5c66a)]/20 bg-neutral-950 px-3 py-2 text-sm'
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
  );
}
