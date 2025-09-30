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

      <h2 className="text-xl font-semibold">1) Responsable & contact</h2>
      <p className="text-muted">
        Aziome (PME locale – Belgique, société en cours de création). Contact :{" "}
        <a href="mailto:aziomeagency@gmail.com" className="underline">
          aziomeagency@gmail.com
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold">2) Données traitées & finalités</h2>
      <ul className="list-disc pl-6 space-y-2 text-muted">
        <li>
          <strong>Formulaire de contact</strong> : nom, prénom, email, société, message —{" "}
          <em>finalité</em> : répondre à votre demande (prospects B2B).
        </li>
        <li>
          <strong>Chatbot IA (assistant simple)</strong> : contenu des messages —{" "}
          <em>finalité</em> : fournir une réponse de premier niveau. Pas d’actions sensibles
          (prise de rendez-vous, envoi d’emails) sans évolution annoncée.
        </li>
      </ul>

      <h2 className="text-xl font-semibold">3) Base légale</h2>
      <p className="text-muted">
        Intérêt légitime (art. 6-1 f RGPD) à traiter les demandes entrantes et à fournir une aide de premier niveau.
      </p>

      <h2 className="text-xl font-semibold">4) Destinataires / Sous-traitants</h2>
      <ul className="list-disc pl-6 space-y-2 text-muted">
        <li><strong>Vercel</strong> (hébergement/déploiement du site).</li>
        <li><strong>GitHub</strong> (hébergement du code – pas de traitement direct des visiteurs).</li>
        <li><strong>Gmail</strong> (réception des messages du formulaire : adresse provisoire).</li>
        <li><strong>OpenAI API</strong> (génération de la réponse du chatbot à partir du message).</li>
      </ul>
      <p className="text-muted">Aucune vente de données. Pas de cession à des partenaires commerciaux.</p>

      <h2 className="text-xl font-semibold">5) Conservation</h2>
      <ul className="list-disc pl-6 space-y-2 text-muted">
        <li><strong>Formulaire</strong> : 12 mois maximum.</li>
        <li><strong>Journaux techniques / chatbot</strong> : 30–90 jours (sécurité & amélioration).</li>
      </ul>

      <h2 className="text-xl font-semibold">6) Cookies & traceurs</h2>
      <p className="text-muted">
        Aucun cookie non essentiel/analytics actif actuellement. Une bannière (CMP) sera ajoutée en cas de déploiement
        de traceurs nécessitant le consentement.
      </p>

      <h2 className="text-xl font-semibold">7) Vos droits</h2>
      <p className="text-muted">
        Droits d’accès, rectification, effacement, limitation, opposition et portabilité (lorsque applicable).
        Demandes à :{" "}
        <a href="mailto:aziomeagency@gmail.com" className="underline">
          aziomeagency@gmail.com
        </a>
        . Réclamation possible auprès de l’Autorité de protection des données (Belgique).
      </p>

      <h2 className="text-xl font-semibold">8) Sécurité</h2>
      <p className="text-muted">
        Principe de minimisation, accès restreints, gestion des clés API, journalisation 30–90 jours.
        Les mesures seront complétées au fur et à mesure du déploiement.
      </p>

      <div className="text-sm text-muted/70 pt-4">Dernière mise à jour : aujourd’hui.</div>
    </section>
  );
}
