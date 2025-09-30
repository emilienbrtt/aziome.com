'use client';

export default function PrivacyPolicy() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-4xl font-semibold mb-2">
        <span className="text-[color:var(--gold-1)]">Politique de confidentialité</span>
      </h1>
      <p className="text-sm text-muted mb-8">Dernière mise à jour : à compléter</p>

      <div className="space-y-10 text-base leading-relaxed text-muted">
        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">1. Responsable</h2>
          <p>Site opéré par <strong className="text-fg">Aziome</strong> (structure en cours de création). Contact : <a className="text-[color:var(--gold-1)] underline underline-offset-2" href="mailto:aziomeagency@gmail.com">aziomeagency@gmail.com</a>. Autorité de contrôle : APD (Belgique).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">2. Données traitées</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Formulaire de contact</strong> : nom, prénom, e-mail, société, message.</li>
            <li><strong>Chatbot IA</strong> : texte saisi et métadonnées minimales (date/heure). <em>Ne pas saisir d’infos sensibles.</em></li>
            <li><strong>Navigation</strong> : pas d’analytics ni de traceurs non essentiels activés à ce jour.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">3. Finalités & bases légales</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="py-2 pr-4">Finalité</th>
                  <th className="py-2 pr-4">Base légale</th>
                  <th className="py-2">Détails</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr className="border-t border-neutral-800">
                  <td className="py-3 pr-4">Réponse aux demandes</td>
                  <td className="py-3 pr-4">Intérêt légitime (B2B)</td>
                  <td className="py-3">Traitement limité aux infos nécessaires.</td>
                </tr>
                <tr className="border-t border-neutral-800">
                  <td className="py-3 pr-4">Échanges via chatbot</td>
                  <td className="py-3 pr-4">Intérêt légitime</td>
                  <td className="py-3">Pas d’actions automatiques (RDV/e-mails) à ce stade.</td>
                </tr>
                <tr className="border-t border-neutral-800">
                  <td className="py-3 pr-4">Fonctionnement & sécurité du site</td>
                  <td className="py-3 pr-4">Intérêt légitime</td>
                  <td className="py-3">Logs techniques minimaux.</td>
                </tr>
                <tr className="border-t border-neutral-800">
                  <td className="py-3 pr-4">Obligations légales</td>
                  <td className="py-3 pr-4">Obligation légale</td>
                  <td className="py-3">Le cas échéant (réquisitions).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">4. Destinataires / sous-traitants</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Vercel</strong> (hébergement/déploiement).</li>
            <li><strong>Google (Gmail)</strong> : réception des messages de contact.</li>
            <li><strong>OpenAI (API)</strong> : génération de réponses du chatbot.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">5. Transferts hors UE</h2>
          <p>Certains prestataires (ex. OpenAI) peuvent impliquer des transferts hors UE/EEE. Ils reposent sur des mécanismes juridiques en vigueur (ex. CCT) et des mesures de minimisation.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">6. Durées de conservation</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Contact</strong> : durée de traitement puis <strong>12 mois max.</strong></li>
            <li><strong>Chatbot</strong> : <strong>12 mois max.</strong></li>
            <li><strong>Logs</strong> : <strong>6–12 mois</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">7. Vos droits</h2>
          <p>Accès, rectification, effacement, limitation, opposition, portabilité, retrait du consentement (si applicable). Contact : <a className="text-[color:var(--gold-1)] underline underline-offset-2" href="mailto:aziomeagency@gmail.com">aziomeagency@gmail.com</a>. Réclamation possible auprès de l’APD.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">8. Sécurité</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>TLS, contrôle d’accès e-mail, MFA si disponible.</li>
            <li>Journalisation technique et sauvegardes côté hébergeur.</li>
            <li>Évitez d’insérer des infos sensibles dans le chatbot.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">9. Cookies & traceurs</h2>
          <p>À ce jour, aucun cookie non essentiel n’est activé. En cas d’analytics ou publicité, une CMP conforme sera déployée et la présente politique mise à jour.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">10. Mineurs</h2>
          <p>Site destiné à un public <strong>B2B</strong>. Non destiné aux mineurs.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">11. Évolutions</h2>
          <p>Newsletter, paiements, analytics, nouvelles zones feront l’objet d’une mise à jour préalable de cette politique avant activation.</p>
        </section>
      </div>
    </section>
  );
}
