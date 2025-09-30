'use client';

export default function LegalMentions() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">
        <span className="text-[color:var(--gold-1)]">Mentions légales</span>
      </h1>

      <div className="space-y-6 text-base leading-relaxed text-muted">
        <p><strong>Éditeur du site</strong> : <span className="text-fg">Aziome</span> — Liège, Belgique.
          <br />Structure en cours de création.</p>

        <p><strong>Contact</strong> : <a className="text-[color:var(--gold-1)] underline underline-offset-2" href="mailto:aziomeagency@gmail.com">aziomeagency@gmail.com</a></p>

        <p><strong>Hébergement & déploiement</strong> : <a className="text-[color:var(--gold-1)] underline underline-offset-2" href="https://vercel.com" target="_blank" rel="noreferrer">Vercel</a>.
          Code géré sur GitHub.</p>

        <p className="text-sm opacity-80">Ces mentions seront complétées dès la création de la société (raison sociale, forme juridique, siège, n° d’entreprise, représentant légal).</p>
      </div>
    </section>
  );
}
