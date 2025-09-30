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
    best: false, // carte repère (décoy)
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
    best: true, // badge “Le plus choisi”
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
            className="rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(212,175,55,0.22)]"
          >
            <Card className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  {p.best && (
                    <span className="text-xs px-2 py-1 rounded-full border border-[color:var(--gold-1)] text-[color:var(--gold-1)]">
                      Le plus choisi
                    <
