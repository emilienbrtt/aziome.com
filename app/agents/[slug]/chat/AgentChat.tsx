'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';

type Role = 'user' | 'assistant';
type Msg = { role: Role; content: string };

export default function AgentChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
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
    // ✅ littéral conservé
    setMsgs((m) => [...m, { role: 'user' as const, content: question }]);
    setLoading(true);

    try {
      // TODO: remplace cette partie par ton appel réel (ex: /api/chat?agent=...)
      // Simu d’une réponse:
      const reply = "Je suis l'agent — comment puis-je aider ?";

      // ✅ littéral conservé
      setMsgs((m) => [...m, { role: 'assistant' as const, content: reply }]);
    } catch (e) {
      // ✅ annote le tableau comme Msg[]
      const next2: Msg[] = [
        ...msgs,
        { role: 'assistant', content: "Désolé, je n’arrive pas à répondre pour le moment." },
      ];
      setMsgs(next2);
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
          Chat avec l’agent
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
