'use client';

export default function CharterIA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Bouton retour (optionnel) */}
      <a
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--gold-1)]/15 text-[color:var(--gold-1)] hover:bg-[color:var(--gold-1)]/25 transition"
      >
        ← Retour à l’accueil
      </a>

      <h1 className="text-3xl md:text-4xl font-semibold mt-6 mb-2">
        Charte IA responsable
      </h1>
      <p className="text-muted mb-8">Notre promesse : simple, claire, vérifiable.</p>

      <ol className="space-y-8 leading-relaxed text-base">
        <li>
          <h2 className="text-xl font-semibold mb-1">1. Vos données vous appartiennent</h2>
          <p className="text-muted">
            Vos données restent les vôtres. Nous ne les revendons pas et ne les partageons pas sans votre accord écrit.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">2. Ce que nous collectons et pourquoi</h2>
          <p className="text-muted">
            Nous collectons uniquement ce qui est nécessaire pour faire fonctionner l’agent : messages, commandes,
            statuts de livraison, réponses et journaux techniques. Nous n’en faisons rien d’autre sans votre accord.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">3. Transparence et traçabilité</h2>
          <p className="text-muted">
            Toutes les actions de l’agent sont enregistrées (qui, quand, quoi).
            Vous pouvez consulter l’historique et demander un export.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">4. Contrôle humain</h2>
          <p className="text-muted">
            Vous pouvez désactiver l’agent, corriger une réponse, passer une conversation à un humain
            et définir des règles d’escalade.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">5. Sécurité</h2>
          <p className="text-muted">
            Données protégées, accès très limités aux personnes autorisées,
            sauvegardes régulières, séparation des environnements.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">6. Durée de conservation et suppression</h2>
          <p className="text-muted">
            Nous conservons les données le temps nécessaire au service.
            Vous pouvez demander un export et une suppression définitive.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">7. Pas d’entraînement sans accord</h2>
          <p className="text-muted">
            Nous n’utilisons pas vos données pour améliorer notre IA sans votre accord explicite.
            Par défaut : non.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">8. Prestataires</h2>
          <p className="text-muted">
            Nous travaillons avec des hébergeurs et outils reconnus qui respectent nos exigences
            de sécurité et de confidentialité. La liste détaillée est disponible sur demande.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">9. Incidents</h2>
          <p className="text-muted">
            En cas de problème de sécurité vous concernant, nous vous informons rapidement
            avec les détails utiles et le plan d’action.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">10. Qualité et limites de l’IA</h2>
          <p className="text-muted">
            L’IA peut se tromper. Nous posons des règles métier, des garde-fous et des validations humaines
            pour éviter les erreurs.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">11. Vos droits</h2>
          <p className="text-muted">
            Vous pouvez accéder à vos données, demander un export, une correction ou une suppression à tout moment.
            Contact : <a href="mailto:privacy@aziome.com" className="text-[color:var(--gold-1)]">privacy@aziome.com</a>
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold mb-1">12. Mises à jour</h2>
          <p className="text-muted">
            Cette charte peut évoluer. Nous indiquons toujours la date de mise à jour et ce qui change.
          </p>
        </li>
      </ol>

      <p className="mt-10 text-xs text-muted">
        Dernière mise à jour : {new Date().toLocaleDateString('fr-BE')}
      </p>
    </section>
  );
}
