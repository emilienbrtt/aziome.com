'use client';

import { useState } from 'react';

export default function ContactClient({ defaultAgent = '' }: { defaultAgent?: string }) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true); setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name:   String(form.get('name') || ''),
      email:  String(form.get('email') || ''),
      company:String(form.get('company') || ''),
      agent:  String(form.get('agent') || ''),
      message:String(form.get('message') || ''),
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSending(false);
    if (res.ok) { setDone(true); (e.currentTarget as HTMLFormElement).reset(); }
    else {
      const t = await res.text().catch(() => '');
      setError(t || 'Échec de l’envoi. Réessayez.');
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl p-6 border border-white/10 bg-white/5">
        <div className="text-lg font-medium">Message envoyé ✅</div>
        <div className="text-muted mt-1">Merci ! Nous revenons vers vous très vite.</div>
        <button className="mt-4 underline" onClick={() => setDone(false)}>Envoyer un autre message</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl p-6 border border-white/10 bg-white/5 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Nom</label>
          <input name="name" required className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2"/>
        </div>
        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input name="email" type="email" required className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2"/>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Entreprise (optionnel)</label>
          <input name="company" className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2"/>
        </div>
        <div>
          <label className="block text-sm mb-1">Agent</label>
          <input name="agent" defaultValue={defaultAgent} className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2"/>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Message</label>
        <textarea name="message" required rows={6} className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2"/>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                   bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg
                   disabled:opacity-60 transition"
      >
        {sending ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  );
}
