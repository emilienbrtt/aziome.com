'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* -------------------- Données -------------------- */
type CardDef = {
  slug: 'max' | 'lea' | 'jules' | 'mia' | 'chris';
  name: 'Max' | 'Léa' | 'Jules' | 'Mia' | 'Chris';
  image: string;
  blurb: string;
};

const CARDS: CardDef[] = [
  { slug: 'max',   name: 'Max',   image: '/agents/max.png',   blurb: "Relance les clients au bon moment et récupère des ventes perdues." },
  { slug: 'lea',   name: 'Léa',   image: '/agents/lea.png',   blurb: "Répond vite, suit les commandes et passe à l’humain si besoin." },
  { slug: 'jules', name: 'Jules', image: '/agents/jules.png', blurb: "Réunit vos chiffres et vous alerte quand quelque chose cloche." },
  { slug: 'mia',   name: 'Mia',   image: '/agents/mia.png',   blurb: "Accueil instantané : pose les bonnes questions et oriente bien." },
  { slug: 'chris', name: 'Chris', image: '/agents/chris.png', blurb: "Gère les demandes internes et la paperasse sans retard." },
];

/* -------------------- Utils mesure -------------------- */
function getGapPx(el: HTMLElement) {
  const g = getComputedStyle(el).gap || '0px';
  return parseFloat(g);
}

/* -------------------- Composant -------------------- */
export default function Solutions() {
  const viewportRef = useRef<HTMLDivElement>(null); // conteneur scrollable
  const trackRef = useRef<HTMLDivElement>(null);    // piste flex
  const slideRef = useRef<HTMLDivElement>(null);    // 1er slide réel pour mesurer

  const [perView, setPerView] = useState(3);
  const [cardFullW, setCardFullW] = useState(0); // largeur carte + gap (px)

  // Clones de début/fin pour boucle infinie
  const slides = useMemo(() => {
    const head = CARDS.slice(-perView);
    const tail = CARDS.slice(0, perView);
    return [...head, ...CARDS, ...tail];
  }, [perView]);

  // Mesure responsive : combien de cartes visibles + largeur d'une carte
  const measure = () => {
    const vp = viewportRef.current;
    const slide = slideRef.current;
    if (!vp || !slide) return;
    const gap = getGapPx(trackRef.current as HTMLElement);
    const full = slide.getBoundingClientRect().width + gap;
    const p = Math.max(1, Math.round(vp.clientWidth / full));
    setPerView(p);
    setCardFullW(full);
  };

  useLayoutEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // On place le scroll au début "réel" (après les clones de tête)
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !cardFullW) return;
    vp.scrollTo({ left: perView * cardFullW, behavior: 'auto' });
  }, [perView, cardFullW]);

  // Boucle infinie : si on dépasse, on téléporte sans animation
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !cardFullW) return;

    let timer: number | undefined;
    const onScroll = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const start = perView * cardFullW;
        const end = (perView + CARDS.length) * cardFullW;

        if (vp.scrollLeft < start - cardFullW / 2) {
          // passé dans les clones de gauche → téléporte à la fin réelle
          vp.scrollTo({ left: vp.scrollLeft + CARDS.length * cardFullW, behavior: 'auto' });
        } else if (vp.scrollLeft > end + cardFullW / 2) {
          // passé dans les clones de droite → téléporte au début réel
          vp.scrollTo({ left: vp.scrollLeft - CARDS.length * cardFullW, behavior: 'auto' });
        }
      }, 80); // 80ms après l'arrêt du scroll
    };

    vp.addEventListener('scroll', onScroll, { passive: true });
    return () => vp.removeEventListener('scroll', onScroll);
  }, [perView, cardFullW]);

  const go = (dir: 'prev' | 'next') => {
    const vp = viewportRef.current;
    if (!vp || !cardFullW) return;
    const delta = dir === 'next' ? vp.clientWidth : -vp.clientWidth;
    vp.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="relative">
        {/* Flèches, plus grandes, de chaque côté */}
        <button
          onClick={() => go('prev')}
          className="hidden sm:flex items-center justify-center
                     absolute left-[-14px] lg:left-[-20px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                     hover:bg-white/10 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => go('next')}
          className="hidden sm:flex items-center justify-center
                     absolute right-[-14px] lg:right-[-20px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                     hover:bg-white/10 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* VIEWPORT : pas de coupe verticale pour laisser respirer la shadow */}
        <div
          ref={viewportRef}
          className="
            overflow-x-auto overflow-y-visible scroll-smooth
            [scrollbar-width:none] [-ms-overflow-style:none]
            py-3
          "
        >
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

          {/* PISTE */}
          <div
            ref={trackRef}
            className="
              flex gap-5 snap-x snap-mandatory
              px-1
            "
          >
            {slides.map((c, i) => (
              <article
                // on marque le premier vrai slide pour mesurer
                ref={i === perView ? slideRef : undefined}
                key={`${c.slug}-${i}`}
                className="
                  snap-start shrink-0
                  w-[85%] sm:w-[60%] md:w-[48%] lg:w-[32%]
                "
              >
                {/* Conteneur EXTERNE : contour gris fin + ombre non coupée */}
                <div
                  className="
                    rounded-2xl ring-1 ring-white/12 bg-[#0b0b0b]
                    hover:ring-[rgba(212,175,55,0.50)]
                    hover:shadow-[0_0_120px_rgba(212,175,55,0.20)]
                    transition
                  "
                >
                  {/* INTERNE : arrondis + découpe, pas d’ombre coupée */}
                  <div className="rounded-[inherit] overflow-hidden">
                    {/* IMAGE HAUTE — taille raisonnable + dégradé profond */}
                    <div
                      className="
                        relative w-full aspect-[4/5]
                        max-h-[420px] md:max-h-[460px] lg:max-h-[500px]
                        bg-black
                      "
                    >
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 48vw, 32vw"
                        className="object-contain object-bottom select-none"
                        priority
                      />
                      {/* Dégradé type Limova jusqu’au texte */}
                      <div
                        className="absolute inset-x-0 bottom-0 pointer-events-none
                                   bg-gradient-to-t from-black/92 via-black/55 to-transparent"
                        style={{ height: '55%' }}
                      />
                    </div>

                    {/* TEXTE */}
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
