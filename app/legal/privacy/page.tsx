export const metadata = {
  title: "Confidentialité — Aziome",
  description:
    "Site vitrine B2B avec formulaire de contact et chatbot. Données limitées à votre demande. Droits RGPD et contact.",
};

export default function Page() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24 space-y-6">
      <h1 className="text-4xl font-semibold gold-text">Politique de confidentialité</h1>

      <p className="text-muted">
        Les données soumises via le formulaire de contact (nom, prénom, email, société, message) sont utilisées
        uniquement pour répondre à votre demande. Conservation maximale : 12 mois. Vous pouvez demander leur
        suppression à tout moment.
      </p>

      <p className="text-muted">
        Chatbot IA : simple assistant (réponse aux messages). Pas d’action automatique sensible (prise de rendez-vous,
        envoi d’emails) sans évolution ultérieure annoncée.
      </p>

      <p className="text-muted">
        Sécurité & conformité : minimisation des données, accès restreints, gestion des clés API, journalisation 30–90 jours,
        réversibilité (export/suppression sur demande).
      </p>

      <p className="text-muted">
        Contact RGPD : <a className="underline" href="mailto:aziomeagency@gmail.com">aziomeagency@gmail.com</a>
      </p>
    </section>
  );
}
