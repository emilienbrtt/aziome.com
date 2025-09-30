'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* --------- Données agents --------- */
type CardDef = {
  slug: 'max' | 'lea' | 'jules' | 'mia' | 'chris';
  name: 'Max' | 'Léa' | 'Jules' | 'Mia' | 'Chris';
  image: string;
  blurb: string;
};

const BASE_CARDS: CardDef[] = [
  { slug: 'max',   name: 'Max',   image: '/agents/max.png',   blurb: "Relance les clients au bon moment et récupère des ventes perdues." },
  { slug: 'lea',   name: 'Léa',   image: '/agents/lea.png',   blurb: "Répond vite, suit les commandes et passe à l’humain si besoin." },
  { slug: 'jules', name: 'Jules', image: '/agents/jules.png', blurb: "Réunit vos chiffres et vous alerte quand quelque chose cloche." },
  { slug: 'mia',   name: 'Mia',   image: '/agents/mia.png',   blurb: "Accueil instantané : pose les bonnes questions et oriente bien." },
  { slug: 'chris', name: 'Chris', image: '/agents/chris.png', blurb: "Gère les demandes internes et la paperasse sans retard." },
];

/* --------- Hook: nombre d’items visibles (1/2/3) --------- */
function usePerView() {
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPerView(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return perView;
}

export default function Solutions() {
  const perView = usePerView();

  // on crée des clones au début et à la fin pour la boucle infinie
  const slides = useMemo(() => {
    const head = BASE_CARDS.slice(-perView);
    const tail = BASE_CARDS.slice(0, perView);
    return [...head, ...BASE_CARDS, ...tail];
  }, [perView]);

  const [index, setIndex] = useState(perView); // on démarre sur le premier réel
  const [anim, setAnim] = useState(true);      // transition active ou non
  const trackRef = useRef<HTMLDivElement>(null);

  // réinitialise l’index quand perView change (resize)
  useEffect(() => {
    setAnim(false);
    setIndex(perView);
    const t = setTimeout(() => setAnim(true), 0);
    return () => clearTimeout(t);
  }, [perView]);

  // navigation
  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  // quand on dépasse en bout, on “téléporte” sans animation sur l’équivalent réel
  useEffect(() => {
    if (!anim) return;
    const total = slides.length;
    if (index === total - perView) {
      // on vient d’entrer dans les clones de fin → retourne au premier réel
      const t = setTimeout(() => {
        setAnim(false);
        setIndex(perView);
        // réactive l’anim au tick suivant
        const t2 = setTimeout(() => setAnim(true), 0);
        return () => clearTimeout(t2);
      }, 300);
      return () => clearTimeout(t);
    }
    if (index === 0) {
      // on vient d’entrer dans les clones de début → retourne aux derniers réels
      const t = setTimeout(() => {
        setAnim(false);
        setIndex(slides.length - (perView * 2));
        const t2 = setTimeout(() => setAnim(true), 0);
        return () => clearTimeout(t2);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [index, anim, slides.length, perView]);

  // largeur d’un slide (en %) = 100 / perView
  const slideW = 100 / perView;
  const translateX = -index * slideW;

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="relative">
        {/* Flèches plus grandes, de chaque côté, toujours actives (boucle) */}
        <button
          onClick={prev}
          className="hidden sm:flex items-center justify-center
                     absolute left-[-12px] lg:left-[-18px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                     hover:bg-white/10 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          className="hidden sm:flex items-center justify-center
                     absolute right-[-12px] lg:right-[-18px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                     hover:bg-white/10 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Piste (pas d’overflow, on gère nous-mêmes le translate) */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-5 will-change-transform"
            style={{
              width: `${(slides.length * slideW).toFixed(4)}%`,
              transform: `translateX(${translateX}%)`,
              transition: anim ? 'transform 380ms ease' : 'none',
            }}
          >
            {slides.map((c, idx) => (
              <article
                key={`${c.slug}-${idx}`} // clé unique y compris clones
                className="shrink-0"
                style={{ width: `${slideW}%` }}
              >
                {/* Conteneur EXTERNE : ring fin tout autour + shadow non coupée */}
                <div
                  className="
                    h-full rounded-2xl ring-1 ring-white/12 bg-[#0b0b0b]
                    hover:ring-[rgba(212,175,55,0.50)]
                    hover:shadow-[0_0_120px_rgba(212,175,55,0.22)]
                    transition
                  "
                >
                  {/* Contenu INTERNE : overflow-hidden pour arrondis propres */}
                  <div className="rounded-[inherit] overflow-hidden">
                    {/* IMAGE HAUTE avec fond + dégradé profond style Limova */}
                    <div className="relative aspect-[4/5] w-full bg-black">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain object-bottom select-none"
                        priority
                      />
                      {/* Dégradé vers le texte (≈55% de la hauteur) */}
                      <div
                        className="absolute inset-x-0 bottom-0 pointer-events-none
                                   bg-gradient-to-t from-black/92 via-black/55 to-transparent"
                        style={{ height: '55%' }}
                      />
                    </div>

                    {/* TEXTE BAS */}
                    <div className="p-5">
                      <h3 className="text-xl font-semibold">{c.name}</h3>
                      <p className="mt-2 text-sm text-muted leading-relaxed">{c.blurb}</p>
                      <Link
                        href={`/agents/${c.slug}`}
                        className="mt-3 inline-block text-sm text-[color:var(--gold-1)]"
                      >
                        Voir les détails →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
