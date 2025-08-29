'use client';
import { useState } from "react";

const items = [
  { q: "Qu’est‑ce qu’un « agent IA » chez Aziome ?", a: "Un employé virtuel spécialisé (SAV, CRM, Reporting) qui exécute des tâches réelles via vos outils habituels." },
  { q: "Que se passe‑t‑il si l’agent ne sait pas répondre ?", a: "Escalade automatique vers un humain (HITL) et journalisation pour amélioration continue." },
  { q: "Quelles données sont nécessaires ?", a: "Accès restreint aux outils requis (Shopify/CRM/Notion…). Principes de minimisation & anonymisation." },
  { q: "Puis‑je arrêter à tout moment ?", a: "Oui. Abonnement mensuel sans engagement long terme (préavis 30 jours recommandé)." },
  { q: "Puis‑je commencer petit ?", a: "Oui, déployez un seul agent puis étendez selon le ROI obtenu." }
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">FAQ</h2>
      <div className="divide-y divide-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-2xl">
        {items.map((it, i) => (
          <button key={i} className="w-full text-left p-5 focus-visible:outline-none" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open===i}>
            <div className="flex items-center justify-between">
              <span className="font-medium">{it.q}</span>
              <span className="text-muted">{open===i ? "–" : "+"}</span>
            </div>
            {open===i && <p className="text-muted mt-2">{it.a}</p>}
          </button>
        ))}
      </div>
    </section>
  );
}
