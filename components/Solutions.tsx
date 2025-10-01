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

const DURATION = 740; // ms
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const GAP = 20; // px

export default function Solutions() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<0 | 1 | -1>(0);     // 1 = next, -1 = prev
  const [anim, setAnim] = useState(false);
  const [suppress, setSuppress] = useState(false);   // coupe transitions pour le reset

  const n = CARDS.length;

  const idxLeft   = useMemo(() => mod(current - 1, n), [current, n]);
  const idxCenter = useMemo(() => current, [current]);
  const idxRight  = useMemo(() => mod(current + 1, n), [current, n]);
  const idxFar    = useMemo(() => dir === 1 ? mod(current + 2, n) : mod(current - 2, n), [current, n, dir]);

  // largeur de slot : 3 slots + 2 gaps = largeur wrap
  const wrapRef = useRef<HTMLDivElement>(null);
  const [slotW, setSlotW] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;
      const total = el.getBoundingClientRect().width;
      setSlotW((total - 2 * GAP) / 3);
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
  }, [anim]);

  const prev = useCallback(() => {
    if (anim) return;
    setDir(-1);
    setAnim(true);
  }, [anim]);

  // fin d'anim → reset piste puis avance l'index sans saccade
  useEffect(() => {
    if (!anim) return;
    const t = setTimeout(() => {
      // 1) coupe transitions
      setSuppress(true);
      // 2) remet la piste à 0 sans anim (1 raf)
      requestAnimationFrame(() => {
        // 3) avance l'index et réactive les transitions (2ᵉ raf)
        setCurrent(c => mod(c + (dir as number), n));
        setDir(0);
        requestAnimationFrame(() => {
          setSuppress(false);
          setAnim(false);
        });
      });
    }, DURATION);
    return () => clearTimeout(t);
  }, [anim, dir, n]);

  /* ================= Cartes ================= */

  const baseCard =
    'rounded-2xl border border-white/12 bg-[#0b0b0b] ' +
    'hover:border-[rgba(212,175,55,0.40)] hover:shadow-[0_0_120px_rgba(212,175,55,0.18)] ' +
    'outline-none focus:outline-none focus-visible:outline-none ' +
    'transition-[border-color,box-shadow]';

  function Card({
    data,
    role,
  }: {
    data: CardDef;
    role: 'left' | 'center' | 'right' | 'edge-left' | 'edge-right';
  }) {
    const isCenter = role === 'center';
    const isSide   = role === 'left' || role === 'right';
    const isEdge   = role === 'edge-left' || role === 'edge-right';

    // tailles visuelles (proportionnelles, jamais rognées)
    const cardScale = isCenter ? 1.02 : 0.94;
    const imgScale  = isCenter ? 1.26 : 1.14;
    const shade     = isCenter ? 0 : 0.22;

    // l'edge est présent tout le temps mais hors-champ au repos
    const off = role === 'edge-right' ? (slotW + GAP) : role === 'edge-left' ? -(slotW + GAP) : 0;
    const edgeTarget = anim ? 0 : off;

    return (
      <article
        className={baseCard}
        style={{
          transform: `scale(${cardScale})`,
          transition: suppress ? 'none' : `transform ${DURATION}ms ${EASE}`,
          willChange: 'transform',
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
                transition: suppress ? 'none' : `transform ${DURATION}ms ${EASE}`,
                willChange: 'transform',
              }}
            />
            {(isSide || isEdge) && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: '#000',
                  opacity: shade,
                  transition: suppress ? 'none' : `opacity ${DURATION}ms ${EASE}`,
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

  /* ============== Séquence : 4 cartes en permanence ============== */
  const seq = useMemo(() => {
    // ordre visuel : [left, center, right, edge]
    const edgeRole = dir === 1 ? ('edge-right' as const) : dir === -1 ? ('edge-left' as const) : ('edge-right' as const);
    const edgeIdx  = dir === 1 ? idxFar : dir === -1 ? idxFar : mod(current + 2, n);
    return [
      { key: `L-${idxLeft}`,   role: 'left' as const,    data: CARDS[idxLeft] },
      { key: `C-${idxCenter}`, role: 'center' as const,  data: CARDS[idxCenter] },
      { key: `R-${idxRight}`,  role: 'right' as const,   data: CARDS[idxRight] },
      { key: `E-${edgeIdx}`,   role: edgeRole,           data: CARDS[edgeIdx] },
    ];
  }, [dir, idxLeft, idxCenter, idxRight, idxFar, current, n]);

  // décalage du track : une largeur de slot + gap
  const trackShift = anim ? (dir === 1 ? -(slotW + GAP) : dir === -1 ? (slotW + GAP) : 0) : 0;

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="relative py-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Flèches */}
        <button
          onClick={prev}
          className="hidden sm:flex items-center justify-center absolute left-[-14px] lg:left-[-22px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full border border-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          className="hidden sm:flex items-center justify-center absolute right-[-14px] lg:right-[-22px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full border border-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Fenêtre + piste */}
        <div ref={wrapRef} className="relative mx-auto max-w-full overflow-visible">
          <div
            className="flex items-stretch justify-center"
            style={{
              gap: `${GAP}px`,
              width: slotW ? `${3 * slotW + 2 * GAP}px` : undefined,
              transform: `translate3d(${trackShift}px,0,0)`,
              transition: suppress ? 'none' : `transform ${DURATION}ms ${EASE}`,
              willChange: 'transform',
            }}
          >
            {seq.map(({ key, role, data }) => (
              <div key={key} className="shrink-0" style={{ width: slotW || undefined }}>
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
