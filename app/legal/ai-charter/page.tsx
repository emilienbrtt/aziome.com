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

      <ul className="list-disc pl-6 space-y-3 text-muted text-lg">
        <li>Transparence : les interactions IA sont identifiées clairement.</li>
        <li>
          HITL (Human-in-the-Loop) : un humain peut superviser, valider ou annuler les actions sensibles.
        </li>
        <li>
          Données : pas d’usage secondaire sans consentement explicite. Pas de fine-tuning sur vos données sans accord.
        </li>
        <li>Journalisation : logs 30–90 jours pour audit et amélioration.</li>
        <li>Réversibilité : export & suppression des données sur demande.</li>
      </ul>
    </section>
  );
}
