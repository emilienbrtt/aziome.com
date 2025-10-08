'use client';

import { useState, type FormEvent } from 'react';

export default function ContactClient({ defaultAgent = '' }: { defaultAgent?: string }) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      company: String(form.get('company') || ''),
      agent: String(form.get('agent') || defaultAgent),
      message: String(form.get('message') || ''),
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSending(false);
    if (res.ok) {
      setDone(true);
      (e.currentTarget as HTMLFormElement).reset();
    } else {
      const t = await res.text().catch(() => '');
      setError(t || 'Échec de l’envoi. Réessayez.');
    }
  }

  if (done) {
    return <div className="rounded-lg border border-white/10 p-4">Merci ! Votre message a été envoyé.</div>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input name="name" placeholder="Votre nom" required className="bg-black/30 rounded-md p-3 border border-white/10" />
      <input name="email" placeholder="Votre email" type="email" required className="bg-black/30 rounded-md p-3 border border-white/10" />
      <input name="company" placeholder="Entreprise (optionnel)" className="bg-black/30 rounded-md p-3 border border-white/10" />
      <input name="agent" placeholder="Agent" defaultValue={defaultAgent} className="bg-black/30 rounded-md p-3 border border-white/10" />
      <textarea name="message" placeholder="Votre message…" required rows={6} className="bg-black/30 rounded-md p-3 border border-white/10" />
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center justify-center rounded-md px-4 py-2 font-medium text-black
                   bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition disabled:opacity-60"
      >
        {sending ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  );
}
