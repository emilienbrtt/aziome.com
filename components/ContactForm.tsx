'use client';

import { useState } from 'react';

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
      setError('Remplis les champs requis et accepte la politique de confidentialité.');
      return;
    }

    // Sujet UNIQUE pour éviter que Gmail regroupe les emails
    const when = new Date().toLocaleString('fr-BE', { hour12: false });
    const subject = `Demande de démo — ${name} — ${when}`;

    try {
      // ENVOI AJAX → votre Gmail via FormSubmit (l’utilisateur reste sur le site)
      const res = await fetch('https://formsubmit.co/ajax/aziomeagency@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          // Métadonnées FormSubmit
          _subject: subject,          // ← sujet unique (nom + date) = emails séparés
          _template: 'table',         // tableau; les libellés viennent des clés ci-dessous
          _captcha: 'false',
          _replyto: email,            // le "Répondre" dans Gmail ira au client

          // ======= CHAMPS AFFICHÉS DANS L’EMAIL (100% FR) =======
          'Nom': name,
          'Email': email,
          'Téléphone': phone,
          'Société': company,
          'Site / Outil': site,
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
            placeholder="Téléphone (optionnel)"
            className="bg-transparent border border-white/10 rounded-lg px-4 py-3"
          />

          <input
            name="company"
            placeholder="Société (optionnel)"
            className="bg-transparent border border-white/10 rounded-lg px-4 py-3"
          />

          <input
            name="site"
            placeholder="Site / Outil principal (optionnel)"
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

          {/* Bouton doré dégradé identique au CTA */}
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
            Ou écrivez-nous :{' '}
            <a href="mailto:aziomeagency@gmail.com" className="text-[color:var(--gold-1)]">
              aziomeagency@gmail.com
            </a>
          </p>
        </form>
      )}
    </section>
  );
}
