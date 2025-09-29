'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import { Headphones, Repeat, BarChart2, MessageCircle, Users } from 'lucide-react';

type Key = 'crm' | 'sav' | 'reporting' | 'accueil' | 'rh' | null;

export default function Solutions() {
  const [selected, setSelected] = useState<Key>(null);

  useEffect(() => {
    if (selected) {
      document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selected]);

  // Données agents
  const allCards = [
    { key: 'crm' as const,       title: 'Max',   bullets: ['Assure le suivi de vos clients et leur envoie des rappels personnalisés pour ne rien oublier.'], Icon: Repeat,         layoutDefault: 'lg:col-span-4 lg:col-start-1' },
    { key: 'sav' as const,       title: 'Léa',   bullets: ['Automatise votre service après-vente (SAV)'],                                                  Icon: Headphones,     layoutDefault: 'lg:col-span-4 lg:col-start-5' },
    { key: 'reporting' as const, title: 'Jules', bullets: ['Regroupe vos chiffres clés et vous alerte si besoin.'],                                        Icon: BarChart2,      layoutDefault: 'lg:col-span-4 lg:col-start-9' },
    { key: 'accueil' as const,   title: 'Mia',   bullets: ['Premier contact de votre entreprise, elle accueille chaque demande et oriente vers la bonne personne.'], Icon: MessageCircle, layoutDefault: 'lg:col-span-4 lg:col-start-3' },
    { key: 'rh' as const,        title: 'Chris', bullets: ['Prend en charge les démarches RH et le support interne, sans paperasse.'],                     Icon: Users,          layoutDefault: 'lg:col-span-4 lg:col-start-7' },
  ];

  // Quand un détail est ouvert -> afficher les 4 restantes en 2×2 centrées
  const layoutWhenOpen = [
    'lg:col-span-4 lg:col-start-3',
    'lg:col-span-4 lg:col-start-7',
    'lg:col-span-4 lg:col-start-3',
    'lg:col-span-4 lg:col-start-7',
  ];

  const visibleCards = selected
    ? allCards.filter(c => c.key !== selected).map((c, i) => ({ ...c, layout: layoutWhenOpen[i] }))
    : allCards.map(c => ({ ...c, layout: c.layoutDefault }));

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-10">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {selected === 'crm'       && <div className="mb-8"><DetailCRM onClose={() => setSelected(null)} /></div>}
      {selected === 'sav'       && <div className="mb-8"><DetailSAV onClose={() => setSelected(null)} /></div>}
      {selected === 'reporting' && <div className="mb-8"><DetailReporting onClose={() => setSelected(null)} /></div>}
      {selected === 'accueil'   && <div className="mb-8"><DetailAccueil onClose={() => setSelected(null)} /></div>}
      {selected === 'rh'        && <div className="mb-8"><DetailRH onClose={() => setSelected(null)} /></div>}

      {/* GRID — mobile: 1 / tablette: 2 / desktop: 12 colonnes */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
        {visibleCards.map(({ key, title, bullets, Icon, layout }) => (
          <div key={key} className={layout}>
            {/* group/relative pour l’effet halo identique à Process (un peu plus fort) */}
            <div className="group relative">
              <Card
                className="
                  relative overflow-hidden
                  transition-[transform,box-shadow] duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_0_90px_rgba(212,175,55,0.35)]
                "
              >
                {/* Halo doré animé */}
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute -inset-1
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-500
                    bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(212,175,55,0.28),transparent_70%)]
                    blur-2xl
                  "
                />
                {/* Anneau subtil qui s’allume */}
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0 rounded-2xl
                    ring-0 group-hover:ring-2 ring-[rgba(212,175,55,0.28)]
                    transition-all duration-300
                  "
                />

                <div className="relative">
                  <div className="flex items-start gap-3 h-full min-h-[120px] md:min-h-[130px]">
                    <Icon className="w-5 h-5 text-[color:var(--gold-1)] drop-shadow shrink-0 mt-0.5" />
                    <div className="flex-1 flex flex-col pb-0.5">
                      <h3 className="text-xl font-semibold">{title}</h3>
                      <ul className="mt-1.5 text-sm text-muted list-disc pl-4 space-y-0.5">
                        {bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                      <button
                        onClick={() => setSelected(key)}
                        aria-expanded={selected === key}
                        className="text-sm mt-2 inline-block text-[color:var(--gold-1)]"
                      >
                        Voir le détail →
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =================== DÉTAILS =================== */

function DetailCRM({ onClose }: { onClose: () => void }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Repeat className="text-[color:var(--gold-1)]" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold">
              Max <span className="text-sm font-normal text-muted">· CRM & Relances</span>
            </h3>
            <button onClick={
