'use client';
import { useState } from 'react';

export default function ContactClient({ defaultAgent = '' }: { defaultAgent?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');

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

    if (res.ok) {
      setState('ok');
      (e.currentTarget as HTMLFormElement).reset();
    } else {
      const t = await res.text().catch(() => '');
      setError(t || 'Une erreur est survenue.');
      setState('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-xl">
      <input name="agent" type="hidden" defaultValue={defaultAgent} />

      <label className="grid gap-1">
        <span className="text-sm text-muted">Nom</span>
        <input
          name="name"
          required
          className="rounded-md bg-black/20 border border-white/10 px-3 py-2"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm text-muted">Email</span>
        <input
          name="email"
          type="email"
          required
          className="rounded-md bg-black/20 border border-white/10 px-3 py-2"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm text-muted">Entreprise (facultatif)</span>
        <input
          name="company"
          className="rounded-md bg-black/20 border border-white/10 px-3 py-2"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm text-muted">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="rounded-md bg-black/20 border border-white/10 px-3 py-2"
        />
      </label>

      <div className="flex items-center gap-4">
        <button
          disabled={state === 'sending'}
          className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                     bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white
                     shadow hover:shadow-lg disabled:opacity-60"
        >
          {state === 'sending' ? 'Envoi…' : 'Envoyer'}
        </button>

        {state === 'ok' && <span className="text-green-400 text-sm">Message envoyé ✔</span>}
        {state === 'error' && <span className="text-red-400 text-sm">{error}</span>}
      </div>
    </form>
  );
}
