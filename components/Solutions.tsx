'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import { Headphones, Repeat, BarChart2, MessageCircle, Users } from 'lucide-react';

type Key = 'crm' | 'sav' | 'reporting' | 'accueil' | 'rh' | null;

export default function Solutions() {
  const [selected, setSelected] = useState<Key>(null);

  useEffect(() => {
    if (selected) document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selected]);

  // Layout cible (12 colonnes) :
  // Row 1: Max (1-4) | Léa (5-8) | Jules (9-12)
  // Row 2: Mia (4-7) | Chris (8-11)  -> centrées

  // Détermine si on ouvre en haut (placeholder) ou en bas (recentrage)
  const openTop = selected === 'crm' || selected === 'sav' || selected === 'reporting';

  // Layouts par défaut
  let layoutMia   = 'lg:col-span-4 lg:col-start-4';
  let layoutChris = 'lg:col-span-4 lg:col-start-8';

  // Si l’un des deux du bas est ouvert, on recentre l’autre
  if (selected === 'accueil') {
    layoutChris = 'lg:col-span-4 lg:col-start-5'; // centre
  }
  if (selected === 'rh') {
    layoutMia = 'lg:col-span-4 lg:col-start-5';   // centre
  }

  const miniCardsBase = [
    {
      key: 'crm' as const,
      title: 'Max',
      bullets: ['Assure le suivi de vos clients et leur envoie des rappels personnalisés pour ne rien oublier.'],
      Icon: Repeat,
      layout: 'lg:col-span-4 lg:col-start-1',
    },
    {
      key: 'sav' as const,
      title: 'Léa',
      bullets: ['Automatise votre service après-vente (SAV)'],
      Icon: Headphones,
      layout: 'lg:col-span-4 lg:col-start-5',
    },
    {
      key: 'reporting' as const,
      title: 'Jules',
      bullets: ['Regroupe vos chiffres clés et vous alerte si besoin.'],
      Icon: BarChart2,
      layout: 'lg:col-span-4 lg:col-start-9',
    },
    {
      key: 'accueil' as const,
      title: 'Mia',
      bullets: ['Premier contact de votre entreprise, elle accueille chaque demande et oriente vers la bonne personne.'],
      Icon: MessageCircle,
      layout: layoutMia,
    },
    {
      key: 'rh' as const,
      title: 'Chris',
      bullets: ['Prend en charge les démarches RH et le support interne, sans paperasse.'],
      Icon: Users,
      layout: layoutChris,
    },
  ];

  // Rendu des cartes avec gestion placeholder / centrage
  const cards = miniCardsBase
    // Si on ouvre en bas, on ne rend pas la carte ouverte (pour permettre le centrage)
    .filter(c => !(selected && !openTop && c.key === selected))
    .map(c => ({
      ...c,
      // Si on ouvre en haut, on place un placeholder invisible à la position ouverte
      isPlaceholder: openTop && selected === c.key,
    }));

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-10">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {selected === 'crm'       && <div className="mb-8"><DetailCRM onClose={() => setSelected(null)} /></div>}
      {selected === 'sav'       && <div className="mb-8"><DetailSAV onClose={() => setSelected(null)} /></div>}
      {selected === 'reporting' && <div className="mb-8"><DetailReporting onClose={() => setSelected(null)} /></div>}
      {selected === 'accueil'   && <div className="mb-8"><DetailAccueil onClose={() => setSelected(null)} /></div>}
      {selected === 'rh'        && <div className="mb-8"><DetailRH onClose={() => setSelected(null)} /></div>}

      {/* GRID — mobile: 1 / tablet: 
