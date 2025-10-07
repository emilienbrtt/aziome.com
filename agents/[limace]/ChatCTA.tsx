'use client';

export default function ChatCTA({ agentName }: { agentName: string }) {
  function openChat() {
    const msg = `Bonjour, je veux parler à l’agent ${agentName}.`;

    // --- CRISP ---
    try {
      // @ts-ignore
      if (window.$crisp) {
        // set d'un attribut de session pour router les scénarios (Automation)
        // Ex.: dans Crisp Automation, utilisez la condition "Session data / agent == Léa"
        // @ts-ignore
        window.$crisp.push(['set', 'session:data', [['agent', agentName]]]);
        // Optionnel: segment dédié
        // @ts-ignore
        window.$crisp.push(['set', 'session:segments', [[`agent-${agentName.toLowerCase()}`]]]);

        // Ouvre + message d’amorçage
        // @ts-ignore
        window.$crisp.push(['do', 'chat:open']);
        // @ts-ignore
        window.$crisp.push(['do', 'message:show', ['text', msg]]);
        return;
      }
    } catch {}

    // --- INTERCOM ---
    try {
      // @ts-ignore
      if (window.Intercom) {
        // Attribut custom pour router côté Intercom (Workflows / Inbox rules)
        // @ts-ignore
        window.Intercom('update', { custom_attributes: { agent: agentName } });
        // @ts-ignore
        window.Intercom('show');
        // Démarre une conversation avec message d’amorçage (si dispo)
        // @ts-ignore
        if (window.Intercom) window.Intercom('startConversation', { message: msg });
        return;
      }
    } catch {}

    // Fallback : page contact avec agent pré-rempli
    window.location.href = `/contact?agent=${encodeURIComponent(agentName)}`;
  }

  return (
    <button
      onClick={openChat}
      className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                 bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition"
      style={{ WebkitTapHighlightColor: 'transparent' }}
      aria-label={`Parler à l’agent ${agentName}`}
    >
      Parler à cet agent →
    </button>
  );
}
