'use client';

import Link from "next/link";
import Card from "./Card";

const plans = [
  {
    name: "Lancement Local",
    price: "349€",
    period: "/mois",
    best: false,
    bullets: [
      "1 agent au choix : Mia (Accueil) ou Léa (SAV)",
      "Intégrations essentielles : e-mail + calendrier",
      "Onboarding 45 min",
      "Support e-mail",
    ],
    cta: { label: "Démarrer", href: "/#contact" },
    note: "Pensé pour les PME locales : accueil rapide des demandes et SAV simple.",
  },
  {
    name: "Croissance",
    price: "599€",
    period: "/mois",
    best: false,
    bullets: [
      "2 agents au choix : Mia / Léa / Max",
      "Slack ou CRM léger",
      "1 visio d’ajustements / mois",
      "Jules (reporting) en option (+79€)",
    ],
    cta: { label: "Essayer Core", href: "/#contact" },
    note: "Plus d’automatisation, sans la boucle de reporting complète.",
  },
  {
    name: "Performance",
    price: "749€",
    period: "/mois",
    best: true,
    bullets: [
      "3 agents inclus : Mia (Accueil) + Léa (SAV) + Jules (Reporting)",
      "Gmail / Calendar / Slack / Notion",
      "Synthèse KPI hebdo",
      "SLA prioritaire",
    ],
    cta: { label: "Réserver ma mise en service", href: "/#contact" },
    note: "Boucle complète : capter → résoudre → piloter.",
  },
];

const addons = [
  "WhatsApp Business +99€ / mois",
  "Support 24/7 +149€ / mois",
  "Multilingue (2 langues sup.) +99€ / mois",
  "Voix / Téléphonie +129€ / mois",
  "Intégrations avancées (HubSpot/ERP/API) +99€ / mois",
];

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold">
          Choisissez votre pack d’agents IA
        </h2>
        <p className="text-muted mt-2">
          Pensé pour les PME locales. Démarrez petit, ajoutez des agents à tout moment.
          <br className="hidden md:block" />
          Mise en service incluse, sans engagement.
        </p>
      </div>

      {/* 3 cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(212,175,55,0.24)]"
          >
            <Card className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  {p.best && (
                    <span className="text-xs px-2 py-1 rounded-full border border-[color:var(--gold-1)] text-[color:var(--gold-1)]">
                      Le plus choisi
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <div className="text-3xl font-semibold">
                    {p.price}
                    <span className="text-base font-normal text-muted"> {p.period}</span>
                  </div>
                  <div className="text-xs text-muted mt-1">Annuel possible (-17%)</div>
                </div>

                <ul className="text-sm text-muted space-y-2 mb-5">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--gold-1)] shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.cta.href}
                  className={`mt-auto inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition
                    ${p.best
                      ? "text-black bg-[linear-gradient(92deg,var(--gold-1),var(--gold-2))] hover:brightness-110"
                      : "border border-[color:var(--gold-1)] text-[color:var(--gold-1)] hover:glass"
                    }`}
                >
                  {p.cta.label}
                </Link>

                <p className="text-xs text-muted mt-3">{p.note}</p>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Bandeau Entreprise pleine largeur */}
      <div className="mt-8 rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(212,175,55,0.24)]">
        <Card className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Entreprise & Sur-mesure</h3>
              <p className="text-muted mt-2 text-sm">
                Besoins spécifiques, volumes importants, conformité avancée, intégrations ERP/CRM,
                voix, multilingue, data gouvernance… Nous concevons un pack adapté.
              </p>
              <p className="text-muted mt-1 text-xs">
                Prix sur devis : discutons de votre périmètre, des volumes et des SLA.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="mailto:aziomeagency@gmail.com?subject=Devis%20Entreprise%20Aziome&body=Bonjour%2C%0A%0ANous souhaitons un devis entreprise pour nos besoins IA.%0A%0AVolume/agents%20estim%C3%A9s%20:%20%0AInt%C3%A9grations%20cl%C3%A9s%20:%20%0AD%C3%A9lais%20:%20%0A%0AMerci."
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-black bg-[linear-gradient(92deg,var(--gold-1),var(--gold-2))] hover:brightness-110"
              >
                Demander un devis
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold border border-[color:var(--gold-1)] text-[color:var(--gold-1)] hover:glass"
              >
                Parler à un expert
              </Link>
            </div>
          </div>

          {/* Add-ons */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="text-xs text-muted">
              <span className="font-medium text-fg">Add-ons :</span>{" "}
              {addons.join(" · ")}
            </div>
            <div className="text-[11px] text-muted mt-2">
              Vous pouvez changer d’agent à tout moment selon vos besoins.
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
