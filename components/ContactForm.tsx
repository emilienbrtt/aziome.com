'use client';

import { useState } from 'react';

function two(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function subjectStamp() {
  const d = new Date();
  const Y = d.getFullYear(), M = two(d.getMonth() + 1), D = two(d.getDate()), h = two(d.getHours()), m = two(d.getMinutes());
  return `${Y}-${M}-${D} ${h}:${m}`; // sujet unique => 1 mail par demande
}

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot anti-bot
    if ((data.get('honey') as string)?.length) return;

    // CHAMPS (tous obligatoires SAUF "company")
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const company = String(data.get('company') || '').trim(); // facultatif
    const message = String(data.get('message') || '').trim();
    const consent = data.get('consent') === 'on';

    if (!name || !email || !phone || !message || !consent) {
      setSending(false);
      setError('Merci de compléter tous les champs requis et d’accepter la politique de confidentialité.');
      return;
    }

    // Sujet FR et unique → évite le regroupement des mails
    const subject = `Aziome • Demande de démo — ${name} — ${subjectStamp()}`;

    try {
      // payload FR propre (on n’envoie "Société" que si rempli)
      const payload: Record<string, string> = {
        _subject: subject,
        _template: 'box',   // rendu propre
        _captcha: 'false',
        _replyto: email,    // "Répondre" dans Gmail → client

        // champs affichés
        'Nom': name,
        'Email': email,
        'Téléphone': phone,
        'Message': message,
      };
      if (company) payload['Société'] = company;

      const res = await fetch('https://formsubmit.co/ajax/aziomeagency@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSent(true);
        form.reset();
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json?.message || "Erreur d’envoi. Écrivez-nous : aziomeagency@gmail.com");
      }
    } catch {
      setError("Problème réseau. Réessayez ou écrivez-nous : aziomeagency@gmail.com");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Demander une démo</h2>

      {sent ? (
        <div className="glass p-6 rounded-2xl">
          Merci ! Votre demande a bien été envoyée. Nous revenons vers vous rapidement.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="glass p-6 rounded-2xl grid gap-4">
          <input
            name="name"
            placeholder="Nom *"
            required
            className="bg-transparent border border-white/10 rounded-lg px-4 py-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email *"
            required
            className="bg-transparent border border-white/10 rounded-lg px-4 py-3"
          />

          <input
            name="phone"
            placeholder="Téléphone *"
            required
            className="bg-transparent border border-white/10 rounded-lg px-4 py-3"
          />

          {/* Société = NON obligatoire, pas d’astérisque, pas de (optionnel) */}
          <input
            name="company"
            placeholder="Société"
            className="bg-transparent border border-white/10 rounded-lg px-4 py-3"
          />

          <textarea
            name="message"
            rows={5}
            placeholder="Votre message *"
            required
            className="bg-transparent border border-white/10 rounded-lg px-4 py-3"
          />

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="consent" className="accent-[color:var(--gold-1)]" />
            J’accepte la politique de confidentialité
          </label>

          {/* Honeypot anti-spam (caché) */}
          <input type="text" name="honey" className="hidden" tabIndex={-1} autoComplete="off" />

          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Bouton doré dégradé */}
          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex items-center justify-center rounded-md px-5 py-3 font-medium
                       text-black shadow transition hover:shadow-lg disabled:opacity-60
                       bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white"
          >
            {sending ? 'Envoi…' : 'Envoyer ma demande'}
          </button>

          <p className="text-sm opacity-70">
            Ou écrivez-nous : <a href="mailto:aziomeagency@gmail.com" className="text-[color:var(--gold-1)]">aziomeagency@gmail.com</a>
          </p>
        </form>
      )}
    </section>
  );
}
