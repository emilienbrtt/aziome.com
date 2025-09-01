'use client';
import Card from "./Card";
import { Headphones, Repeat, BarChart2 } from "lucide-react";

export default function Solutions() {
  return (
    <>
      {/* --- Bloc cartes --- */}
      <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
        <p className="text-muted mb-10">Nous packons l’IA pour vos tâches à fort impact.</p>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-start gap-3">
              <Headphones className="text-[color:var(--gold-1)]" />
              <div>
                <h3 className="text-xl font-semibold">SAV</h3>
                <ul className="mt-2 text-sm text-muted list-disc pl-4 space-y-1">
                  <li>Suivi colis, retours, FAQ intelligentes</li>
                  <li>Multi-canal (email, chat, WhatsApp)</li>
                </ul>
                <a
                  href="#sav"
                  className="text-sm mt-3 inline-block text-[color:var(--gold-1)] relative z-10"
                >
                  Voir le détail →
                </a>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <Repeat className="text-[color:var(--gold-1)]" />
              <div>
                <h3 className="text-xl font-semibold">CRM & Relances</h3>
                <ul className="mt-2 text-sm text-muted list-disc pl-4 space-y-1">
                  <li>Relances paniers & post-achat</li>
                  <li>Réactivation clients</li>
                </ul>
                <a
                  href="#crm"
                  className="text-sm mt-3 inline-block text-[color:var(--gold-1)] relative z-10"
                >
                  Voir le détail →
                </a>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <BarChart2 className="text-[color:var(--gold-1)]" />
              <div>
                <h3 className="text-xl font-semibold">Reporting & KPI</h3>
                <ul className="mt-2 text-sm text-muted list-disc pl-4 space-y-1">
                  <li>Tableaux de bord unifiés</li>
                  <li>Alertes anomalies</li>
                </ul>
                <a
                  href="#reporting"
                  className="text-sm mt-3 inline-block text-[color:var(--gold-1)] relative z-10"
                >
                  Voir le détail →
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* --- Sections de détail (cibles des ancres) --- */}
      <section
        id="sav"
        className="max-w-6xl mx-auto px-6 scroll-mt-24 mt-16 pt-10 border-t border-white/10"
      >
        <h3 className="text-2xl font-semibold">SAV — Détails</h3>
        <p className="mt-3 text-muted">
          Réponses L1 multi-canal (email, chat, WhatsApp), suivi colis/retours, FAQ intelligentes. Escalade humaine (HITL).
        </p>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>Intégrations : Gorgias, Zendesk, Freshdesk, Shopify, Gmail/Outlook.</li>
          <li>Journalisation, validation humaine, reprise manuelle.</li>
          <li>KPIs : temps de réponse, taux de résolution, CSAT.</li>
        </ul>
        <a href="/#contact" className="inline-block mt-6 text-[color:var(--gold-1)]">Demander une démo →</a>
        <a href="#solutions" className="block mt-2 text-sm opacity-70">↑ Retour aux solutions</a>
      </section>

      <section
        id="crm"
        className="max-w-6xl mx-auto px-6 scroll-mt-24 mt-16 pt-10 border-t border-white/10"
      >
        <h3 className="text-2xl font-semibold">CRM & Relances — Détails</h3>
        <p className="mt-3 text-muted">
          Relances paniers, post-achat et réactivation. Qualification, mise à jour CRM, séquences traçables.
        </p>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>Intégrations : HubSpot, Pipedrive, Klaviyo, Mailchimp.</li>
          <li>Scénarios : paniers abandonnés, NPS bas, anniversaires d’inactivité.</li>
          <li>KPIs : taux d’ouverture, conversion, revenu incrémental.</li>
        </ul>
        <a href="/#contact" className="inline-block mt-6 text-[color:var(--gold-1)]">Demander une démo →</a>
        <a href="#solutions" className="block mt-2 text-sm opacity-70">↑ Retour aux solutions</a>
      </section>

      <section
        id="reporting"
        className="max-w-6xl mx-auto px-6 scroll-mt-24 mt-16 pt-10 border-t border-white/10"
      >
        <h3 className="text-2xl font-semibold">Reporting & KPI — Détails</h3>
        <p className="mt-3 text-muted">
          Tableaux de bord unifiés, alertes anomalies, résumés exécutifs. Données agrégées depuis vos outils, mises à jour auto.
        </p>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li>Sources : Shopify, Stripe, Meta/Google Ads, GA4, ERP, CRM.</li>
          <li>Alertes : seuils, tendances inhabituelles, ruptures de série.</li>
          <li>Livrables : dashboard + rapport hebdo clair.</li>
        </ul>
        <a href="/#contact" className="inline-block mt-6 text-[color:var(--gold-1)]">Demander une démo →</a>
        <a href="#solutions" className="block mt-2 text-sm opacity-70">↑ Retour aux solutions</a>
      </section>
    </>
  );
}
