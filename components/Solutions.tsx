'use client';
import { useState, useEffect } from 'react';
import Card from "./Card";
import { Headphones, Repeat, BarChart2 } from "lucide-react";

type Key = 'sav' | 'crm' | 'reporting' | null;

type Mini = {
  key: Exclude<Key, null>;
  title: string;
  bullets: string[];
  Icon: any;
};

export default function Solutions() {
  const [selected, setSelected] = useState<Key>(null);

  // Remonter la vue quand un détail s'ouvre
  useEffect(() => {
    if (selected) {
      const el = document.getElementById('solutions');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selected]);

  // ⚠️ Ordre cible garanti par desiredOrder + tri
  const desiredOrder: Exclude<Key, null>[] = ['crm', 'sav', 'reporting'];

  const miniCards: Mini[] = [
    { key: 'crm',       title: 'CRM & Relances', bullets: ['Relances paniers', 'Clients qui reviennent'], Icon: Repeat },
    { key: 'sav',       title: 'SAV',            bullets: ['Réponses aux clients', 'Suivi des commandes'], Icon: Headphones },
    { key: 'reporting', title: 'Reporting & KPI',bullets: ['Chiffres à jour', 'Alertes simples'],          Icon: BarChart2 },
  ];

  const othersBase = selected ? miniCards.filter(c => c.key !== selected) : miniCards;
  const others = [...othersBase].sort(
    (a, b) => desiredOrder.indexOf(a.key) - desiredOrder.indexOf(b.key)
  );

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-10">Une aide intelligente qui fait les tâches répétitives à votre place.</p>

      {/* Grande carte au-dessus quand un agent est sélectionné */}
      {selected && (
        <div className="mb-8">
          <DetailCard which={selected as Exclude<Key, null>} onClose={() => setSelected(null)} />
        </div>
      )}

      {/* En dessous : soit 3 mini cartes, soit les 2 restantes (ordre forcé) */}
      <div className={`grid gap-6 ${selected ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {others.map(({ key, title, bullets, Icon }) => (
          <Card key={key}>
            <div className="flex items-start gap-3">
              <Icon className="text-[color:var(--gold-1)]" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{title}</h3>
                <ul className="mt-2 text-sm text-muted list-disc pl-4 space-y-1">
                  {bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <button
                  onClick={() => setSelected(key)}
                  aria-expanded={selected === key}
                  className="text-sm mt-3 inline-block text-[color:var(--gold-1)] relative z-10"
                >
                  Voir le détail →
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------------- Grande carte détaillée ---------------------- */
function DetailCard({ which, onClose }: { which: Exclude<Key, null>; onClose: () => void }) {
  if (which === 'sav') {
    return (
      <Card>
        <div className="flex items-start gap-3">
          <Headphones className="text-[color:var(--gold-1)]" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-semibold">SAV</h3>
              <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
            </div>

            <p className="mt-3 text-muted">
              <strong>Ce que l’agent fait :</strong> répond aux questions courantes, vérifie le suivi des commandes,
              envoie une réponse claire validée par vous, passe à un humain si c’est particulier.
            </p>

            <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium">Se connecte à</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  <li>Outil de support : Gorgias, Zendesk, Freshdesk</li>
                  <li>Boutique : Shopify, WooCommerce</li>
                  <li>Messages : email, chat, WhatsApp</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Mise en place (5 jours)</h4>
                <ol className="list-decimal pl-5 space-y-1 text-muted">
                  <li>J1 : accès aux outils + règles simples</li>
                  <li>J2 : branchements support & boutique</li>
                  <li>J3 : réponses types + règles de sécurité</li>
                  <li>J4 : tests sur votre historique + seuils de transfert</li>
                  <li>J5 : mise en ligne progressive + suivi</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium">Suivi & livrables</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  <li>Temps de première réponse</li>
                  <li>Demandes résolues par l’IA (%)</li>
                  <li>Satisfaction clients</li>
                  <li>Journal des réponses + bouton « reprendre la main »</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (which === 'crm') {
    return (
      <Card>
        <div className="flex items-start gap-3">
          <Repeat className="text-[color:var(--gold-1)]" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-semibold">CRM & Relances</h3>
              <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
            </div>

            <p className="mt-3 text-muted">
              <strong>Ce que l’agent fait :</strong> relance les paniers oubliés, envoie un message après l’achat
              (avis, recommandation), fait revenir les anciens clients, passe à un humain si le client répond.
            </p>

            <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium">Scénarios inclus</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  <li>Paniers abandonnés (2–3 rappels)</li>
                  <li>Après achat : avis + recommandation</li>
                  <li>Réactivation des anciens clients</li>
                  <li>Mise à jour simple du fichier clients</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Se connecte à</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  <li>Email/SMS : Klaviyo, Mailchimp, Brevo, Twilio</li>
                  <li>CRM : HubSpot, Pipedrive</li>
                  <li>Boutique/Paiement : Shopify, Stripe</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Suivi & livrables</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  <li>Ouvertures & clics</li>
                  <li>Ventes récupérées</li>
                  <li>Clients réactivés</li>
                  <li>Journal des envois et réponses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // reporting
  return (
    <Card>
      <div className="flex items-start gap-3">
        <BarChart2 className="text-[color:var(--gold-1)]" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold">Reporting & KPI</h3>
            <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
          </div>

          <p className="mt-3 text-muted">
            <strong>Ce que l’agent fait :</strong> regroupe vos chiffres (ventes, support, marketing), tient un tableau simple à jour,
            explique en clair, alerte en cas de problème.
          </p>

          <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium">Sources & connecteurs</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Boutique & paiement : Shopify, Woo, Stripe</li>
                <li>Marketing : Meta Ads, Google Ads, GA4</li>
                <li>Fichiers & CRM (lecture) : Google Sheets, CRM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Livrables</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Tableau de bord à jour</li>
                <li>Alertes (seuils anormaux, ruptures)</li>
                <li>Petit résumé hebdo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Données & contrôle</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Accès en lecture uniquement</li>
                <li>Règles simples de confidentialité</li>
                <li>Validation humaine pour les cas sensibles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
