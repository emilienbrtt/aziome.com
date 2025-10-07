'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const qs = useSearchParams();
  const agentFromQS = qs.get('agent') ?? '';

  const [agent] = useState(agentFromQS);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<null | 'ok' | 'ko'>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setDone(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent, name, company, email, message }),
      });
      if (!res.ok) throw new Error('Bad status');
      setDone('ok');
      setName(''); setCompany(''); setEmail(''); setMessage('');
    } catch {
      setDone('ko');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6">
        Parler de l’agent {agent || '—'}
      </h1>

      <form onSubmit={onSubmit} className="glass rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Agent</label>
          <input className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2" value={agent} readOnly />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">Nom</label>
            <input className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2"
              value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Société (optionnel)</label>
            <input className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2"
              value={company} onChange={e=>setCompany(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">E-mail</label>
          <input type="email" className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2"
            value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Message</label>
          <textarea rows={6} className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2"
            value={message} onChange={e=>setMessage(e.target.value)} required
            placeholder={`Bonjour, je veux parler de l’agent ${agent || 'Aziome'}.`} />
        </div>

        <button type="submit" disabled={sending}
          className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                     bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition disabled:opacity-60">
          {sending ? 'Envoi…' : 'Envoyer'}
        </button>

        {done==='ok' && <p className="text-sm text-green-400">Message envoyé. On revient vers vous vite 👍</p>}
        {done==='ko' && <p className="text-sm text-red-400">Oups, échec d’envoi. Réessayez dans un instant.</p>}
      </form>
    </section>
  );
}
