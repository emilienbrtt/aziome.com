'use client';
import { useState } from 'react';

export default function ContactClient({ defaultAgent = '' }: { defaultAgent?: string }) {
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setErr(null);

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setOk(true);
      (e.currentTarget as HTMLFormElement).reset();
    } catch (e: any) {
      setErr(e?.message || 'Échec de l’envoi');
    } finally {
      setSending(false);
    }
  }

  if (ok) {
    return (
      <div className="mt-6 rounded-xl p-4 bg-green-600/20 ring-1 ring-green-500/30">
        Merci ! Nous revenons vers vous rapidement.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-xl">
      <input name="name" placeholder="Votre nom" required
             className="bg-transparent rounded-lg ring-1 ring-white/10 px-4 py-3" />
      <input type="email" name="email" placeholder="Votre e-mail" required
             className="bg-transparent rounded-lg ring-1 ring-white/10 px-4 py-3" />
      <input name="company" placeholder="Entreprise (optionnel)"
             className="bg-transparent rounded-lg ring-1 ring-white/10 px-4 py-3" />
      <input name="agent" defaultValue={defaultAgent} placeholder="Agent (ex. Max)"
             className="bg-transparent rounded-lg ring-1 ring-white/10 px-4 py-3" />
      <textarea name="message" rows={5} required
                placeholder="Dites-nous ce dont vous avez besoin"
                className="bg-transparent rounded-lg ring-1 ring-white/10 px-4 py-3" />
      {err && <p className="text-red-400 text-sm">{err}</p>}
      <button disabled={sending}
              className="justify-self-start inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                         bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition
                         disabled:opacity-60">
        {sending ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  );
}
