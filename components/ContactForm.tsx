'use client';

import { useState } from 'react';

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function beTimestamp() {
  const d = new Date();
  // Heure Belgique
  const formatter = new Intl.DateTimeFormat('fr-BE', {
    timeZone: 'Europe/Brussels',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
  const human = formatter.format(d); // ex: 02/09/2025, 14:07:33
  // ISO lisible pour le sujet (YYYY-MM-DD HH:MM)
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  const isoShort = `${y}-${m}-${day} ${h}:${min}`;
  return { human, isoShort };
}
function refId() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }

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

    // anti-bot (honeypot caché)
    if ((data.get('honey') as string)?.length) return;

    // champs
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const company = String(data.get('company') || '').trim();
    const site = String(data.get('site') || '').trim();
    const message = String(data.get('message') || '').trim();
    const consent = data.get('consent') === 'on';

    if (!name || !email || !message || !consent) {
      setSending(false);
      setError('Merci de remplir les champs requis et d’accepter la politique de confidentialité.');
      return;
    }

    // Sujet UNIQUE → 1 email par demande (Gmail ne regroupe pas)
    const { human, isoShort } = beTimestamp();
    const id = refId();
    const page = typeof window !== 'undefined' ? window.location.href : '';
    const subject = `Aziome • Demande de démo — ${name} — ${isoShort}`;

    // Corps structuré (FR), template "table" propre
    // On contrôle 100% les libellés (FR) + on ajoute un Résumé clair
    const resume =
      `Reçu le : ${human} (Europe/Brussels)\n` +
      `Référence : ${id}\n` +
      (page ? `Page source : ${page}\n` : '');

    const details =
      `• Société : ${company || '—'}\n` +
      `• Site / Outil : ${site || '—'}\n` +
      `• Téléphone : ${phone || '—'}`;

    try {
      const res = await fetch('https://formsubmit.co/ajax/aziomeagency@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          // ---- Options FormSubmit ----
          _subject: subject,   // sujet unique => emails séparés
          _template: 'table',  // rendu clair en tableau (sans “Someone…”)
          _captcha: 'false',
          _replyto: email,     // "Répondre" dans Gmail -> adresse du client

          // ---- Contenu 100% FR (ordre = lisibilité) ----
          'Résumé': resume,
          'Nom': name,
          'Email': email,
          'Détails': details,
          'Message': message,
        }),
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
          <input name="name" placeholder="Nom *" required className="bg-transparent border border-white/10 rounded-lg px-4 py-3" />
          <input name="email" type="email" placeholder="Email *" required className="bg-transparent border border-white/10 rounded-lg px-4 py-3" />
          <input name="phone" placeholder="Téléphone (optionnel)" className="bg-transparent border border-white/10 rounded-lg px-4 py-3" />
          <input name="company" placeholder="Société (optionnel)" className="bg-transparent border border-white/10 rounded-lg px-4 py-3" />
          <input name="site" placeholder="Site / Outil principal (optionnel)" className="bg-transparent border border-white/10 rounded-lg px-4 py-3" />
          <textarea name="message" rows={5} placeholder="Votre message *" required className="bg-transparent border border-white/10 rounded-lg px-4 py-3" />

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="consent" className="accent-[color:var(--gold-1)]" />
            J’accepte la politique de confidentialité
          </label>

          {/* Honeypot anti-spam (caché) */}
          <input type="text" name="honey" className="hidden" tabIndex={-1} autoComplete="off" />

          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Bouton doré dégradé (pro, lisible) */}
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
