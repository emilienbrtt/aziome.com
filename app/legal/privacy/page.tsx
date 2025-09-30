export const metadata = { title: "Confidentialité — Aziome" };

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

      <h1 className="text-4xl font-semibold gold-text">Politique de confidentialité</h1>

      <p className="text-lg text-muted">
        Les données soumises via le formulaire de contact (nom, prénom, email, société, message)
        sont utilisées uniquement pour répondre à votre demande. Conservation maximale&nbsp;: 12&nbsp;mois.
        Vous pouvez demander leur suppression à tout moment.
      </p>

      <p className="text-lg text-muted">
        Chatbot IA&nbsp;: simple assistant (réponse aux messages). Pas d’action automatique sensible
        (prise de rendez-vous, envoi d’emails) sans évolution ultérieure annoncée.
      </p>

      <p className="text-lg text-muted">
        Sécurité & conformité&nbsp;: minimisation des données, accès restreints, gestion des clés API,
        journalisation 30–90&nbsp;jours, réversibilité (export/suppression sur demande).
      </p>

      <p className="text-lg text-muted">
        Contact RGPD&nbsp;:{" "}
        <a href="mailto:aziomeagency@gmail.com" className="underline">
          aziomeagency@gmail.com
        </a>
        .
      </p>
    </section>
  );
}
