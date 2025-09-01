'use client';
import { useState } from 'react';
import Card from "./Card";
import { Headphones, Repeat, BarChart2 } from "lucide-react";

type Key = 'sav' | 'crm' | 'reporting' | null;

export default function Solutions() {
  const [open, setOpen] = useState<Key>(null);

  const order: Array<Exclude<Key, null>> =
    open ? [open, ...(['sav','crm','reporting'] as const).filter(k => k !== open)] 
         : (['sav','crm','reporting'] as const);

  const renderCard = (key: Exclude<Key, null>) => {
    const expanded = open === key;
    const colSpan = expanded ? 'md:col-span-3' : 'md:col-span-1';

    if (key === 'sav') {
      return (
        <div key="sav" className={`${colSpan} transition-all`}>
          <Card>
            <div className="flex items-start gap-3">
              <Headphones className="text-[color:var(--gold-1)]" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">SAV</h3>
                <ul className="mt-2 text-sm text-muted list-disc pl-4 space-y-1">
                  <li>Suivi colis, retours, FAQ intelligentes</li>
                  <li>Multi-canal (email, chat, WhatsApp)</li>
                </ul>

                {!expanded ? (
                  <button
                    onClick={() => setOpen('sav')}
                    className="text-sm mt-3 inline-block text-[color:var(--gold-1)]"
                  >
                    Voir le détail →
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setOpen(null)}
                      className="text-sm mt-3 inline-block text-[color:var(--gold-1)]"
                    >
                      Fermer le détail ↑
                    </button>

                    <div className="mt-4 border-t border-white/10 pt-4 text-sm space-y-3">
                      <p className="text-muted">
                        <strong>Ce que l’agent fait :</strong> prend en charge les tickets L1, vérifie le statut des commandes,
                        propose des réponses approuvées et escalade en humain si nécessaire (HITL).
                      </p>

                      <div>
                        <h4 className="font-medium">Intégrations</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted">
                          <li>Helpdesks : Gorgias, Zendesk, Freshdesk</li>
                          <li>E-commerce : Shopify, WooCommerce</li>
                          <li>Messagerie : Gmail/Outlook, WhatsApp, chat web</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium">Onboarding en 5 jours</h4>
                        <ol className="list-decimal pl-5 space-y-1 text-muted">
                          <li><strong>J1 :</strong> accès outils, import FAQ/politiques, collecte modèles</li>
                          <li><strong>J2 :</strong> connexions (helpdesk/boutique), mapping des intents</li>
                          <li><strong>J3 :</strong> réponses canoniques + garde-fous</li>
                          <li><strong>J4 :</strong> tests sur historique, seuils d’escalade</li>
                          <li><strong>J5 :</strong> go-live progressif + suivi</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-medium">KPIs & livrables</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted">
                          <li>FRT, % résolution L1, CSAT</li>
                          <li>Playbook SAV, journalisation, bouton “Reprendre en humain”</li>
                        </ul>
                      </div>

                      <div className="pt-2">
                        <a href="/#contact" className="inline-flex items-center px-4 py-2 rounded-md border border-white/10 hover:border-white/30">
                          Demander une démo
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (key === 'crm') {
      return (
        <div key="crm" className={`${colSpan} transition-all`}>
          <Card>
            <div className="flex items-start gap-3">
              <Repeat className="text-[color:var(--gold-1)]" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">CRM & Relances</h3>
                <ul className="mt-2 text-sm text-muted list-disc pl-4 space-y-1">
                  <li>Relances paniers & post-achat</li>
                  <li>Réactivation clients</li>
                </ul>

                {!expanded ? (
                  <button
                    onClick={() => setOpen('crm')}
                    className="text-sm mt-3 inline-block text-[color:var(--gold-1)]"
                  >
                    Voir le détail →
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setOpen(null)}
                      className="text-sm mt-3 inline-block text-[color:var(--gold-1)]"
                    >
                      Fermer le détail ↑
                    </button>

                    <div className="mt-4 border-t border-white/10 pt-4 text-sm space-y-3">
                      <p className="text-muted">
                        <strong>Ce que l’agent fait :</strong> déclenche et personnalise des séquences de relance
                        (paniers, post-achat, win-back) et met à jour le CRM automatiquement.
                      </p>

                      <div>
                        <h4 className="font-medium">Workflows inclus</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted">
                          <li>Paniers abandonnés (2–3 touches : preuve sociale, garantie, code unique)</li>
                          <li>Post-achat : upsell pertinent + demande d’avis (NPS)</li>
                          <li>Win-back 60/90/180 jours avec offre conditionnelle</li>
                          <li>Qualification B2B + mise à jour auto des champs CRM</li>
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
                          <li>Taux d’ouverture / clic / conversion, revenu incrémental</li>
                          <li>Playbook de séquences, templates validés, journalisation</li>
                        </ul>
                      </div>

                      <div className="pt-2">
                        <a href="/#contact" className="inline-flex items-center px-4 py-2 rounded-md border border-white/10 hover:border-white/30">
                          Demander une démo
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      );
    }

   
