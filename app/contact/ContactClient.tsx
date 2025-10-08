'use client';

import { useState } from 'react';

export default function ContactClient({ defaultAgent = '' }: { defaultAgent?: string }) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);
    setDone(false);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      company: String(form.get('company') || ''),
      agent: String(form.get('agent') || ''),
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
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="font-medium">Bien reçu ✅</div>
        <div className="text-sm text-muted mt-1">On revient vers vous très vite.</div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
      <input
        type="hidden"
        name="agent"
        defaultValue={defaultAgent}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted">Nom</label>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-[rgba(212,175,55,0.6)]"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label className="text-sm text-muted">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-[rgba(212,175,55,0.6)]"
            placeholder="vous@exemple.com"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-muted">Entreprise (optionnel)</label>
        <input
          name="company"
          className="mt-1 w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-[rgba(212,175,55,0.6)]"
          placeholder="Nom de votre société"
        />
      </div>

      <div>
        <label className="text-sm text-muted">Message</label>
        <textarea
          name="message"
          required
          rows={6}
          className="mt-1 w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-[rgba(212,175,55,0.6)]"
          placeholder={`Question(s) à propos de l’agent ${defaultAgent || ''}…`}
        />
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                   bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg
                   disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {sending ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  );
}
