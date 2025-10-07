// app/contact/page.tsx (chez toi: application/contact/page.tsx)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Aziome',
  description: "Parler d'un agent IA, poser une question, demander une démo.",
};

export default function ContactPage({
  searchParams,
}: {
  searchParams: { agent?: string };
}) {
  const agent = (searchParams?.agent || '').trim();
  return <ClientContact agent={agent} />;
}

'use client';

import { useEffect, useRef, useState } from 'react';

function ClientContact({ agent }: { agent: string }) {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Ouvre le chat (si Crisp/Intercom chargé) + message pré-rempli
  useEffect(() => {
    const msg = agent
      ? `Bonjour, je veux parler de l’agent ${agent}.`
      : `Bonjour, j’aimerais parler d’un agent.`;
    try {
      // @ts-ignore
      if (window.$crisp) {
        // @ts-ignore
        window.$crisp.push(['do', 'chat:open']);
        // @ts-ignore
        window.$crisp.push(['do', 'message:show', ['text', msg]]);
      }
    } catch {}
    try {
      // @ts-ignore
      if (window.Intercom) {
        // @ts-ignore
        window.Intercom('show');
        // @ts-ignore
        window.Intercom('startConversation', { message: msg });
      }
    } catch {}
  }, [agent]);

  const defaultMessage = agent
    ? `Je veux parler de l’agent ${agent}.\n\nMon besoin : `
    : `Je veux parler d’un agent.\n\nMon besoin : `;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);

    // 👉 si tu n’as pas d’API encore, le fallback mailto partira automatiquement.
    const endpoint = '/api/contact';

    try {
      const res = await fetch(endpoint, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Request failed');
      setSent(true);
    } catch {
      const subject = agent
        ? `Aziome — Parler de l’agent ${agent}`
        : 'Aziome — Contact';
      const body = encodeURIComponent(
        `Nom: ${fd.get('name')}\nEmail: ${fd.get('email')}\nEntreprise: ${fd.get('company')}\n\n${fd.get('message')}`
      );
      window.location.href = `mailto:hello@aziome.com?subject=${encodeURIComponent(
        subject
      )}&body=${body}`;
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-20">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">
        Parler de {agent ? `l’agent ${agent}` : 'votre agent IA'}
      </h1>

      <div className="glass rounded-2xl p-6 md:p-8">
        {sent ? (
          <div className="text-green-300">Merci ! On revient vers vous très vite.</div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1">Nom</label>
                <input name="name" required
                  className="w-full rounded-md bg-black/20 border border-white/10 px-3 py-2 outline-none focus:border-[rgba(212,175,55,0.5)]" />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Email</label>
                <input name="email" type="email" required
                  className="w-full rounded-md bg-black/20 border border-white/10 px-3 py-2 outline-none focus:border-[rgba(212,175,55,0.5)]" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">Entreprise</label>
              <input name="company"
                className="w-full rounded-md bg-black/20 border border-white/10 px-3 py-2 outline-none focus:border-[rgba(212,175,55,0.5)]" />
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">Message</label>
              <textarea name="message" rows={6} defaultValue={defaultMessage}
                className="w-full rounded-md bg-black/20 border border-white/10 px-3 py-2 outline-none focus:border-[rgba(212,175,55,0.5)]" />
            </div>

            <input type="hidden" name="agent" value={agent} />
            <input type="hidden" name="source" value="contact-page" />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                           bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition">
                Envoyer
              </button>

              <button
                type="button"
                onClick={() => {
                  // @ts-ignore
                  if (window.$crisp) window.$crisp.push(['do', 'chat:open']);
                  // @ts-ignore
                  if (window.Intercom) window.Intercom('show');
                }}
                className="text-sm text-[color:var(--gold-1)] hover:opacity-90"
              >
                Ou discuter en direct →
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-6">
        <a href="/agents" className="text-sm text-[color:var(--gold-1)] hover:opacity-90">
          ← Revenir aux agents
        </a>
      </div>
    </section>
  );
}
