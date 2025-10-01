'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CardDef = {
  slug: string;
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

const mod = (a: number, n: number) => ((a % n) + n) % n;

// Anim propre et fluide
const DURATION = 740; // ms
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const GAP = 20;       // px entre cartes

export default function Solutions() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<0 | 1 | -1>(0);        // 1 = next, -1 = prev
  const [anim, setAnim] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [edgeLive, setEdgeLive] = useState(false);      // apparition progressive edge

  const n = CARDS.length;

  const idxLeft   = useMemo(() => mod(current - 1, n), [current, n]);
  const idxCenter = useMemo(() => mod(current, n), [current, n]);
  const idxRight  = useMemo(() => mod(current + 1, n), [current, n]);
  const idxFar    = useMemo(() => dir === 1 ? mod(current + 2, n) : mod(current - 2, n), [current, n, dir]);

  // largeur de slot identique pour toutes les cartes (évite les reflows)
  const wrapRef = useRef<HTMLDivElement>(null);
  const [slotW, setSlotW] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;
      // 3 slots + 2 gaps = 100% de la largeur dispo → on calcule un slot
      const total = el.getBoundingClientRect().width;
      const w = (total - 2 * GAP) / 3;
      setSlotW(w);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // swipe mobile
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? next() : prev();
  };

  const next = useCallback(() => {
    if (anim) return;
    setDir(1);
    setAnim(true);
    setEdgeLive(false);
    requestAnimationFrame(() => setEdgeLive(true)); // déclenche proprement le fade/slide-in
  }, [anim]);

  const prev = useCallback(() => {
    if (anim) return;
    setDir(-1);
    setAnim(true);
    setEdgeLive(false);
    requestAnimationFrame(() => setEdgeLive(true));
  }, [anim]);

  // Fin d'anim → on avance l'index, reset sans transition
  useEffect(() => {
    if (!anim) return;
    const t = setTimeout(() => {
      setCurrent(c => mod(c + dir, n));
      setDir(0);
      setNoTransition(true);      // pas de transition pendant le reset
      setEdgeLive(false);
      setAnim(false);
      requestAnimationFrame(() => setNoTransition(false));
    }, DURATION + 24);
    return () => clearTimeout(t);
  }, [anim, dir, n]);

  /* ================= Card ================= */
  const baseCard =
    'rounded-2xl border border-white/12 bg-[#0b0b0b] ' +
    'hover:border-[rgba(212,175,55,0.40)] hover:shadow-[0_0_120px_rgba(212,175,55,0.18)] ' +
    'outline-none focus:outline-none focus-visible:outline-none ' +
    'transition-[border-color,box-shadow]';

  function Card({
    data,
    role,        // 'left' | 'center' | 'right' | 'edge-left' | 'edge-right'
  }: {
    data: CardDef;
    role: 'left' | 'center' | 'right' | 'edge-left' | 'edge-right';
  }) {
    const isCenter = role === 'center';
    const isSide = role === 'left' || role === 'right';
    const isEdge = role === 'edge-left' || role === 'edge-right';

    const cardScale = isCenter ? 1.02 : 0.94;     // cadre visuellement + grand au centre
    const imgScale  = isCenter ? 1.24 : 1.12;     // image plus grande mais jamais coupée
    const shade     = isCenter ? 0 : 0.22;        // latérales plus sombres

    const enterOffset = role === 'edge-right' ? 40 : role === 'edge-left' ? -40 : 0;

    return (
      <article
        className={baseCard}
        style={{
          transform: `scale(${cardScale})`,
          transition: noTransition ? 'none' : `transform ${DURATION}ms ${EASE}`,
          opacity: isEdge ? (edgeLive ? 1 : 0) : 1,
          translate: isEdge ? `${edgeLive ? 0 : enterOffset}px 0` : undefined,
          transitionProperty: noTransition ? undefined : 'transform, opacity, translate',
          transitionDuration: noTransition ? undefined : `${DURATION}ms`,
          transitionTimingFunction: noTransition ? undefined : EASE,
          willChange: 'transform, opacity',
        }}
      >
        <div className="rounded-[inherit] overflow-hidden">
          <div className="relative aspect-[4/5] w-full bg-black">
            <Image
              src={data.image}
              alt={data.name}
              fill
              priority
              sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
              className="object-contain object-bottom select-none"
              style={{
                transform: `scale(${imgScale})`,
                transition: noTransition ? 'none' : `transform ${DURATION}ms ${EASE}`,
                willChange: 'transform',
              }}
            />
            {(isSide || isEdge) && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'rgba(0,0,0,1)',
                  opacity: shade,
                  transition: noTransition ? 'none' : `opacity ${DURATION}ms ${EASE}`,
                }}
              />
            )}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-black/92 via-black/60 to-transparent"
              style={{ height: '58%' }}
            />
          </div>

          <div className="p-5">
            <h3 className="text-xl font-semibold">{data.name}</h3>
            <p className={'mt-2 text-sm leading-relaxed text-muted ' + (isCenter ? '' : ' line-clamp-1')}>
              {data.blurb}
            </p>
            <Link href={`/agents/${data.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
              Voir les détails →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  /* ============== Séquence affichée ============== */
  const seq = useMemo(() => {
    if (dir === 1) {
      // next : left, center, right, edge-right
      return [
        { key: `L-${idxLeft}`,   role: 'left' as const,        data: CARDS[idxLeft]   },
        { key: `C-${idxCenter}`, role: 'center' as const,      data: CARDS[idxCenter] },
        { key: `R-${idxRight}`,  role: 'right' as const,       data: CARDS[idxRight]  },
        { key: `E-${idxFar}`,    role: 'edge-right' as const,  data: CARDS[idxFar]    },
      ];
    }
    if (dir === -1) {
      // prev : edge-left, left, center, right
      return [
        { key: `E-${idxFar}`,    role: 'edge-left' as const,   data: CARDS[idxFar]    },
        { key: `L-${idxLeft}`,   role: 'left' as const,        data: CARDS[idxLeft]   },
        { key: `C-${idxCenter}`, role: 'center' as const,      data: CARDS[idxCenter] },
        { key: `R-${idxRight}`,  role: 'right' as const,       data: CARDS[idxRight]  },
      ];
    }
    // repos : left, center, right
    return [
      { key: `L-${idxLeft}`,   role: 'left' as const,    data: CARDS[idxLeft]   },
      { key: `C-${idxCenter}`, role: 'center' as const,  data: CARDS[idxCenter] },
      { key: `R-${idxRight}`,  role: 'right' as const,   data: CARDS[idxRight]  },
    ];
  }, [dir, idxLeft, idxCenter, idxRight, idxFar]);

  // décalage du track : une largeur de slot + gap
  const trackShift = dir === 1 ? -(slotW + GAP) : dir === -1 ? (slotW + GAP) : 0;

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="relative py-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* flèches */}
        <button
          onClick={() => prev()}
          className="hidden sm:flex items-center justify-center absolute left-[-14px] lg:left-[-22px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full border border-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => next()}
          className="hidden sm:flex items-center justify-center absolute right-[-14px] lg:right-[-22px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full border border-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* fenêtre */}
        <div ref={wrapRef} className="relative mx-auto max-w-full overflow-visible">
          {/* piste */}
          <div
            className="flex items-stretch justify-center"
            style={{
              gap: `${GAP}px`,
              transform: `translateX(${trackShift}px)`,
              transition: noTransition ? 'none' : `transform ${DURATION}ms ${EASE}`,
              willChange: 'transform',
            }}
          >
            {seq.map(({ key, role, data }) => (
              <div key={key} style={{ width: slotW || undefined }} className="shrink-0">
                <Card data={data} role={role} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 md:hidden text-center text-xs text-muted">Balayez pour changer d’agent</div>
      </div>
    </section>
  );
}
