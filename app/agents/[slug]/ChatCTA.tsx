'use client';

type Props = { agentName: string };

export default function ChatCTA({ agentName }: Props) {
  const prefill = `Bonjour, je veux parler à l’agent ${agentName}.`;

  const openChat = () => {
    // 1) CRISP (si présent)
    try {
      if (typeof window !== 'undefined' && (window as any).$crisp) {
        const w = window as any;
        // Segment pour router côté Crisp (optionnel)
        w.$crisp.push(['set', 'session:segments', [[`agent-${agentName.toLowerCase()}`]]]);
        // Ouvrir + message pré-rempli
        w.$crisp.push(['do', 'chat:open']);
        w.$crisp.push(['do', 'message:show', ['text', prefill]]);
        return;
      }
    } catch {}

    // 2) INTERCOM (si présent)
    try {
      if (typeof window !== 'undefined' && (window as any).Intercom) {
        const w = window as any;
        w.Intercom('update', { agent: agentName });
        w.Intercom('show');
        w.Intercom('showNewMessage', prefill);
        return;
      }
    } catch {}

    // 3) Fallback : page Contact pré-remplie
    if (typeof window !== 'undefined') {
      window.location.href = `/contact?agent=${encodeURIComponent(agentName)}`;
    }
  };

  return (
    <button
      type="button"
      onClick={openChat}
      className="mt-6 inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                 bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition"
      aria-label={`Parler à l’agent ${agentName}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      Parler à cet agent →
    </button>
  );
}
