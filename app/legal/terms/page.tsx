export const metadata = { title: "Mentions légales — Aziome" };

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

      <h1 className="text-4xl font-semibold gold-text">Mentions légales</h1>

      <p className="text-muted">
        <strong>Aziome</strong> — Liège, Belgique. Contact :{" "}
        <a href="mailto:aziomeagency@gmail.com" className="underline">
          aziomeagency@gmail.com
        </a>
        .
      </p>

      <p className="text-muted">
        <em>Société en cours de création.</em> Raison sociale, forme juridique, n° d’entreprise et siège seront ajoutés
        à l’immatriculation.
      </p>

      <div className="text-sm text-muted/70 pt-4">
        Dernière mise à jour : aujourd’hui.
      </div>
    </section>
  );
}
