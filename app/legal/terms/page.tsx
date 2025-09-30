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

      <p className="text-lg text-muted">
        Aziome — Liège, Belgique. Contact :{" "}
        <a href="mailto:aziomeagency@gmail.com" className="underline">
          aziomeagency@gmail.com
        </a>
        .
      </p>

      <p className="text-lg text-muted">
        Raison sociale et n° d’entreprise : à compléter lors de la création de la société.
      </p>
    </section>
  );
}
