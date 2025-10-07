'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ContactPage() {
  const qs = useSearchParams();
  const defaultAgent = qs.get('agent') ?? '';
  const [agent, setAgent] = useState(defaultAgent);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => setAgent(defaultAgent), [defaultAgent]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !message) return;

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, agent, message }),
      });
      if (!res.ok) throw new Error('send_failed');
      setDone(true);
      formRef.current?.reset();
      setMessage('');
    } catch (err) {
      alert("Oups, l'envoi a échoué. Réessayez.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6">Parler de l’agent {agent || ''}</h1>

      <form ref={formRef} onSubmit={onSubmit} className="glass rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm mb-1">Agent</label>
          <input
            className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2"
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            placeholder="Max / Léa / …"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Votre nom (optionnel)</label>
          <input
            className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prénom Nom"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Votre e-mail</label>
          <input
            required
            type="email"
            className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Votre besoin</label>
          <textarea
            required
            rows={6}
            className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Expliquez brièvement votre besoin…"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                     bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition disabled:opacity-60"
        >
          {sending ? 'Envoi…' : 'Envoyer'}
        </button>

        {done && <p className="text-green-400 text-sm">Merci ! Votre message a bien été envoyé.</p>}
      </form>
    </section>
  );
}
