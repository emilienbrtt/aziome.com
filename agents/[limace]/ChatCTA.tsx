'use client';

type Props = { agentName: string };

export default function ChatCTA({ agentName }: Props) {
  const prefill = `Bonjour, je veux parler à l’agent ${agentName}.`;

  const openChat = () => {
    // CRISP (si présent)
    try {
      const w = window as any;
      if (w.$crisp) {
        w.$crisp.push(['set', 'session:data', [[['agent', agentName]]]]);
        w.$crisp.push(['do', 'chat:open']);
        w.$crisp.push(['do', 'message:show', ['text', prefill]]);
        return;
      }
    } catch {}

    // INTERCOM (si présent)
    try {
      const w = window as any;
      if (w.Intercom) {
        w.Intercom('update', { agent: agentName });
        w.Intercom('show');
        w.Intercom('showNewMessage', prefill);
        return;
      }
    } catch {}

    // Fallback : page contact avec l’agent pré-rempli
    window.location.href = `/contact?agent=${encodeURIComponent(agentName)}`;
  };

  return (
    <button
      onClick={openChat}
      className="mt-6 inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                 bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition"
    >
      Parler à cet agent →
    </button>
  );
}
