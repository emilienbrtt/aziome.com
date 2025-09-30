'use client';

export default function CharterIA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">
        <span className="text-[color:var(--gold-1)]">Charte IA responsable</span>
      </h1>

      <ul className="list-disc pl-5 space-y-4 text-base leading-relaxed text-muted">
        <li><strong>Transparence</strong> : les interactions IA sont clairement identifiées.</li>
        <li><strong>Humain-dans-la-boucle</strong> : supervision/validation/arrêt par un humain pour les actions sensibles.</li>
        <li><strong>Données</strong> : pas d’usage secondaire sans accord ; pas d’entraînement sur vos contenus sans consentement.</li>
        <li><strong>Journalisation raisonnable</strong> : logs 30–90 jours pour audit et amélioration.</li>
        <li><strong>Réversibilité</strong> : export & suppression des données sur demande.</li>
      </ul>
    </section>
  );
}
