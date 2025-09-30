export const metadata = { title: "Charte IA responsable — Aziome" };

import Link from "next/link";

export default function Page() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-black shadow-glow bg-[linear-gradient(92deg,var(--gold-1),var(--gold-2))] hover:brightness-110"
        >
          ← Retour à l’accueil
        </Link>
      </div>

      <h1 className="text-4xl font-semibold gold-text">Charte IA responsable</h1>

      <ul className="list-disc pl-6 space-y-3 text-muted">
        <li><strong>Transparence</strong> : interactions IA clairement identifiées.</li>
        <li><strong>Human-in-the-Loop</strong> : un humain peut superviser, valider ou annuler les actions sensibles.</li>
        <li><strong>Données</strong> : pas d’usage secondaire sans consentement explicite. Pas de fine-tuning sur vos données sans accord.</li>
        <li><strong>Journalisation</strong> : logs 30–90 jours pour sécurité, audit et amélioration.</li>
        <li><strong>Réversibilité</strong> : export & suppression de vos données sur demande.</li>
      </ul>

      <div className="text-sm text-muted/70 pt-4">Dernière mise à jour : aujourd’hui.</div>
    </section>
  );
}
