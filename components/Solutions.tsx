'use client';
import { useState } from 'react';
import Card from "./Card";
import { Headphones, Repeat, BarChart2 } from "lucide-react";

type PanelKey = 'sav' | 'crm' | 'reporting' | null;

export default function Solutions() {
  const [open, setOpen] = useState<PanelKey>(null);
  const toggle = (key: PanelKey) => setOpen(prev => (prev === key ? null : key));

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-10">Nous packons l’IA pour vos tâches à fort impact.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* -------- SAV -------- */}
        <Card>
          <div className="flex items-start gap-3">
            <Headphones className="text-[color:var(--gold-1)]" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">SAV</h3>
              <ul className="mt-2 text-sm text-muted list-disc pl-4 space-y-1">
                <li>Suivi colis, retours, FAQ intelligentes</li>
                <li>Multi-canal (email, chat, WhatsApp)</li>
              </ul>

              <button
                onClick={() => toggle('sav')}
                aria-expanded={open === 'sav'}
                aria-controls="sav-panel"
                className="text-sm mt-3 inline-block text-[color:var(--gold-1)] relative z-10"
              >
                {open === 'sav' ? 'Fermer le détail ↑' : 'Voir le détail →'}
              </button>

              {open === 'sav' && (
                <div
                  id="sav-panel"
                  className="mt-4 border-t border-white/10 pt-4 text-sm space-y-3"
                >
                  <p className="text-muted">
                    <strong>Ce que l’agent fait :</strong> prend en charge les tickets L1, vérifie le statut des commandes,
                    propose des réponses approuvées et escalade en humain si nécessaire (HITL).
                  </p>
                  <div>
                    <h4 className="font-medium">Intégrations</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      <li>Helpdesks : Gorgias, Zendesk, Freshdesk.</li>
                      <li>E-commerce : Shopify, WooCommerce.</li>
                      <li>Messagerie : Gmail/Outlook, WhatsApp (Meta), chat web.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Onboarding en 5 jours</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-muted">
                      <li><strong>Jour 1 :</strong> accès outils, import FAQ/politiques, collecte emails modèles.</li>
                      <li><strong>Jour 2 :</strong> connexions (helpdesk, boutique), mapping des intents.</li>
                      <li><strong>Jour 3 :</strong> rédaction des réponses canoniques + garde-fous.</li>
                      <li><strong>Jour 4 :</strong> tests sur historique contrôlé, seuils d’escalade.</li>
                      <li><strong>Jour 5 :</strong> go-live progressif (heures creuses), suivi.</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium">Prérequis côté client</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      <li>Accès helpdesk + boutique (lecture), modèles de réponses existants.</li>
                      <li>Politique retours / remboursement, ton de marque.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">KPIs & livrables</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      <li>FRT (first response time), % résolution L1, CSAT.</li>
                      <li>Playbook SAV, journalisation des actions, bouton “Reprendre en humain”.</li>
                    </ul>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <a
                      href="/#contact"
                      className="inline-flex items-center px-4 py-2 rounded-md border border-white/10 hover:border-white/30"
                    >
                      Demander une démo
                    </a>
                    <button
                      onClick={() => toggle('sav')}
                      className="text-xs opacity-70 underline"
                    >
                      Masquer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* -------- CRM & Relances -------- */}
        <Card>
          <div className="flex items-start gap-3">
            <Repeat className="text-[color:var(--gold-1)]" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">CRM & Relances</h3>
              <ul className="mt-2 text-sm text-muted list-disc pl-4 space-y-1">
                <li>Relances paniers & post-achat</li>
                <li>Réactivation clients</li>
              </ul>

              <button
                onClick={() => toggle('crm')}
                aria-expanded={open === 'crm'}
                aria-controls="crm-panel"
                className="text-sm mt-3 inline-block text-[color:var(--gold-1)] relative z-10"
              >
                {open === 'crm' ? 'Fermer le détail ↑' : 'Voir le détail →'}
              </button>

              {open === 'crm' && (
                <div
                  id="crm-panel"
                  className="mt-4 border-t border-white/10 pt-4 text-sm space-y-3"
                >
                  <p className="text-muted">
                    <strong>Ce que l’agent fait :</strong> déclenche et personnalise des séquences de relance
                    (paniers, post-achat, win-back) et met à jour le CRM automatiquement.
                  </p>
                  <div>
                    <h4 className="font-medium">Intégrations</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      <li>CRM : HubSpot, Pipedrive.</li>
                      <li>Emails/SMS : Klaviyo, Mailchimp, Brevo, Twilio.</li>
                      <li>Commerce & paiements : Shopify, Stripe.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Workflows inclus</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      <li>Paniers abandonnés en 2-3 touches (preuve sociale, garantie, code unique).</li>
                      <li>Post-achat : upsell pertinent + demande d’avis (NPS).</li>
                      <li>Win-back 60/90/180 jours avec offre conditionnelle.</li>
                      <li>Qualification B2B + mise à jour auto des champs CRM.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Prérequis côté client</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      <li>Accès CRM et emailer, segments cibles, offres/bon plans.</li>
                      <li>Style de marque (ton, contraintes légales, RGPD).</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">KPIs & livrables</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      <li>Taux d’ouverture / clic / conversion, revenu incrémental.</li>
                      <li>Playbook de séquences, templates validés, journalisation.</li>
                    </ul>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <a
                      href="/#contact"
                      className="inline-flex items-center px-4 py-2 rounded-md border border-white/10 hover:border-white/30"
                    >
                      Demander une démo
                    </a>
                    <button
                      onClick={() => toggle('crm')}
                      className="text-xs opacity-70 underline"
                    >
                      Masquer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* -------- Reporting & KPI -------- */}
        <Card>
          <div className="flex items-start gap-3">
            <BarChart2 className="text-[color:var(--gold-1)]" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Reporting & KPI</h3>
              <ul className="mt-2 text-sm text-muted list-disc pl-4 space-y-1">
                <li>Tableaux de bord unifiés</li>
                <li>Alertes anomalies</li>
              </ul>

              <button
                onClick={() => toggle('reporting')}
                aria-expanded={open === 'reporting'}
                aria-controls="reporting-panel"
                className="text-sm mt-3 inline-block text-[color:var(--gold-1)] relative z-10"
              >
                {open === 'reporting' ? 'Fermer le détail ↑' : 'Voir le détail →'}
              </button>

              {open === 'reporting' && (
                <div
                  id="reporting-panel"
                  className="mt-4 border-t border-white/10 pt-4 text-sm space-y-3"
                >
                  <p className="text-muted">
                    <strong>Ce que l’agent fait :</strong> agrège vos données (vente, marketing, finance),
                    synthétise en langage clair et alerte en cas d’anomalie.
                  </p>
                  <div>
                    <h4 className="font-medium">Sources & connecteurs</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      <li>Commerce & paiement : Shopify, Woo, Stripe.</li>
                      <li>Marketing : Meta/Google Ads, GA4.</li>
                      <li>Ops : ERP/Sheets/CRM (lecture seule).</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Livrables</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      <li>Dashboard unifié (hebdo), résumé exécutif auto (email/Slack).</li>
                      <li>Alertes : seuils, variations anormales, rupture de tendance.</li>
                      <li>Glossaire de métriques + traçabilité des calculs.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Prérequis & gouvernance</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      <li>Accès en lecture aux outils, liste de KPIs “north star”.</li>
                      <li>RGPD/HITL : aucun envoi de données sensibles hors cadre validé.</li>
                    </ul>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <a
                      href="/#contact"
                      className="inline-flex items-center px-4 py-2 rounded-md border border-white/10 hover:border-white/30"
                    >
                      Demander une démo
                    </a>
                    <button
                      onClick={() => toggle('reporting')}
                      className="text-xs opacity-70 underline"
                    >
                      Masquer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
