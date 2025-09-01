'use client';
import { useState, useEffect } from 'react';
import Card from "./Card";
import { Headphones, Repeat, BarChart2 } from "lucide-react";

type Key = 'sav' | 'crm' | 'reporting' | null;

export default function Solutions() {
  const [selected, setSelected] = useState<Key>(null);

  // remonte la vue sur la zone quand on ouvre un détail
  useEffect(() => {
    if (selected) {
      const el = document.getElementById('solutions');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selected]);

  // helpers d’affichage
  const miniCards: { key: Exclude<Key, null>; title: string; bullets: string[]; Icon: any }[] = [
    { key: 'sav', title: 'SAV', bullets: ['Suivi colis, retours, FAQ intelligentes', 'Multi-canal (email, chat, WhatsApp)'], Icon: Headphones },
    { key: 'crm', title: 'CRM & Relances', bullets: ['Relances paniers & post-achat', 'Réactivation clients'], Icon: Repeat },
    { key: 'reporting', title: 'Reporting & KPI', bullets: ['Tableaux de bord unifiés', 'Alertes anomalies'], Icon: BarChart2 },
  ];

  const others = selected
    ? miniCards.filter(c => c.key !== selected)
    : miniCards;

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-10">Nous packons l’IA pour vos tâches à fort impact.</p>

      {/* --- Carte détaillée en GRAND au-dessus quand un agent est sélectionné --- */}
      {selected && (
        <div className="mb-8">
          <DetailCard
            which={selected}
            onClose={() => setSelected(null)}
          />
        </div>
      )}

      {/* --- En dessous : soit 3 mini cartes (aucun sélectionné), soit les 2 restantes --- */}
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

/* ---------------------- Composant: grande carte détaillée ---------------------- */
function DetailCard({ which, onClose }: { which: Exclude<Key, null>; onClose: () => void }) {
  // contenu spécifique par agent
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
              <strong>Ce que l’agent fait :</strong> prend en charge les tickets L1, vérifie le statut des commandes,
              propose des réponses approuvées et escalade en humain si nécessaire (HITL).
            </p>

            <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium">Intégrations</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  <li>Helpdesks : Gorgias, Zendesk, Freshdesk</li>
                  <li>E-commerce : Shopify, WooCommerce</li>
                  <li>Messagerie : Gmail/Outlook, WhatsApp, chat web</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Onboarding (5 jours)</h4>
                <ol className="list-decimal pl-5 space-y-1 text-muted">
                  <li>Accès outils, import FAQ/politiques</li>
                  <li>Connexions & mapping des intents</li>
                  <li>Réponses canoniques + garde-fous</li>
                  <li>Tests sur historique, seuils d’escalade</li>
                  <li>Go-live progressif + suivi</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium">KPIs & livrables</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  <li>FRT, % résolution L1, CSAT</li>
                  <li>Playbook SAV, journalisation</li>
                  <li>Bouton “Reprendre en humain”</li>
                </ul>
              </div>
            </div>
            {/* CTA DEMO retiré comme demandé */}
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
              <strong>Ce que l’agent fait :</strong> personnalise des séquences (paniers, post-achat, win-back),
              met à jour le CRM et journalise toutes les actions.
            </p>

            <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium">Workflows inclus</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  <li>Paniers abandonnés (2-3 touches)</li>
                  <li>Post-achat : upsell + avis (NPS)</li>
                  <li>Win-back 60/90/180j</li>
                  <li>Qualification B2B + MAJ champs CRM</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Intégrations</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  <li>CRM : HubSpot, Pipedrive</li>
                  <li>Email/SMS : Klaviyo, Mailchimp, Brevo, Twilio</li>
                  <li>Commerce & paiement : Shopify, Stripe</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">KPIs & livrables</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted">
                  <li>Open / Click / Conversion, revenu incrémental</li>
                  <li>Playbook de séquences & templates validés</li>
                </ul>
              </div>
            </div>
            {/* CTA DEMO retiré */}
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
            <strong>Ce que l’agent fait :</strong> agrège ventes/marketing/finance, explique en clair,
            et alerte sur les anomalies.
          </p>

          <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium">Sources & connecteurs</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Commerce & paiement : Shopify, Woo, Stripe</li>
                <li>Marketing : Meta/Google Ads, GA4</li>
                <li>Ops : ERP / Google Sheets / CRM (lecture)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Livrables</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Dashboard unifié (hebdo) + résumé exécutif</li>
                <li>Alertes : seuils, variations anormales, ruptures</li>
                <li>Glossaire + traçabilité des calculs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Gouvernance & RGPD</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Accès en lecture, KPIs “north star”</li>
                <li>HITL : validation humaine des sorties sensibles</li>
              </ul>
            </div>
          </div>
          {/* CTA DEMO retiré */}
        </div>
      </div>
    </Card>
  );
}
