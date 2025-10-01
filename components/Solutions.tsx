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

// utils
const mod = (a: number, n: number) => ((a % n) + n) % n;

// ---------- Animation params (fluide) ----------
const DURATION = 820; // ms – plus doux
// Ease-in-out SINE : départ/arrivée lisses, pas d'accélération au milieu
function ease(t: number) {
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}
const GAP = 20; // px entre cartes
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Solutions() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<0 | 1 | -1>(0);
  const [anim, setAnim] = useState(false);
  const [progress, setProgress] = useState(0);
  const [suppress, setSuppress] = useState(false);

  const n = CARDS.length;

  const idxLeft   = useMemo(() => mod(current - 1, n), [current, n]);
  const idxCenter = useMemo(() => mod(current, n), [current, n]);
  const idxRight  = useMemo(() => mod(current + 1, n), [current, n]);
  const idxFar    = useMemo(() => (dir === 1 ? mod(current + 2, n) : mod(current - 2, n)), [current, n, dir]);

  // Mesure largeur d’un slot (3 slots visibles + 2 gaps)
  const sceneRef = useRef<HTMLDivElement>(null);
  const [slotW, setSlotW] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const el = sceneRef.current;
      if (!el) return;
      const total = el.getBoundingClientRect().width;
      setSlotW((total - 2 * GAP) / 3);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Swipe mobile
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
    setProgress(0);
  }, [anim]);

  const prev = useCallback(() => {
    if (anim) return;
    setDir(-1);
    setAnim(true);
    setProgress(0);
  }, [anim]);

  // RAF : fait évoluer progress avec easing (glisse + scale synchronisés)
  useEffect(() => {
    if (!anim) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setProgress(ease(t));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setSuppress(true);
        setProgress(0);
        setDir(0);
        setCurrent(c => mod(c + (dir as number), n));
        requestAnimationFrame(() => {
          setSuppress(false);
          setAnim(false);
        });
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [anim, dir, n]);

  // ---------- États visuels (scales + glisse) ----------
  // Cartes : centre légèrement plus grand que côtés
  const CARD_SCALE_CENTER = 1.03;
  const CARD_SCALE_SIDE   = 0.94;

  // Images : plus grandes, mais toujours contenues (object-contain)
  const IMG_SCALE_CENTER  = 1.22;
  const IMG_SCALE_SIDE    = 1.10;

  const slideBy   = slotW + GAP;
  const sceneShift =
    dir === 1 ? -slideBy * progress :
    dir === -1 ?  slideBy * progress :
    0;

  const scaleFor = (role: 'left' | 'center' | 'right') => {
    if (dir === 1) {
      if (role === 'center') return lerp(CARD_SCALE_CENTER, CARD_SCALE_SIDE, progress);
      if (role === 'right')  return lerp(CARD_SCALE_SIDE,   CARD_SCALE_CENTER, progress);
      return CARD_SCALE_SIDE;
    }
    if (dir === -1) {
      if (role === 'center') return lerp(CARD_SCALE_CENTER, CARD_SCALE_SIDE, progress);
      if (role === 'left')   return lerp(CARD_SCALE_SIDE,   CARD_SCALE_CENTER, progress);
      return CARD_SCALE_SIDE;
    }
    return role === 'center' ? CARD_SCALE_CENTER : CARD_SCALE_SIDE;
  };

  const imgScaleFor = (role: 'left' | 'center' | 'right') => {
    if (dir === 1) {
      if (role === 'center') return lerp(IMG_SCALE_CENTER, IMG_SCALE_SIDE, progress);
      if (role === 'right')  return lerp(IMG_SCALE_SIDE,   IMG_SCALE_CENTER, progress);
      return IMG_SCALE_SIDE;
    }
    if (dir === -1) {
      if (role === 'center') return lerp(IMG_SCALE_CENTER, IMG_SCALE_SIDE, progress);
      if (role === 'left')   return lerp(IMG_SCALE_SIDE,   IMG_SCALE_CENTER, progress);
      return IMG_SCALE_SIDE;
    }
    return role === 'center' ? IMG_SCALE_CENTER : IMG_SCALE_SIDE;
  };

  // Assombrissement des latérales
  const shadeFor = (role: 'left' | 'center' | 'right') => {
    const SIDE_SHADE = 0.22;
    if (dir === 1) {
      if (role === 'center') return lerp(0, SIDE_SHADE, progress);
      if (role === 'right')  return lerp(SIDE_SHADE, 0, progress);
      return SIDE_SHADE;
    }
    if (dir === -1) {
      if (role === 'center') return lerp(0, SIDE_SHADE, progress);
      if (role === 'left')   return lerp(SIDE_SHADE, 0, progress);
      return SIDE_SHADE;
    }
    return role === 'center' ? 0 : SIDE_SHADE;
  };

  // ---------- Carte ----------
  const baseCard =
    'rounded-2xl border border-white/12 bg-[#0b0b0b] ' + // bord discret (blanc, pas bleu)
    'hover:border-[rgba(212,175,55,0.40)] hover:shadow-[0_0_120px_rgba(212,175,55,0.18)] ' +
    'outline-none focus:outline-none focus-visible:outline-none ' +
    'transition-[border-color,box-shadow]';

  function Card({
    data,
    role,                 // 'left' | 'center' | 'right' | 'edge-left' | 'edge-right'
    edgeOffset,           // px : position absolue de la carte entrante
  }: {
    data: CardDef;
    role: 'left' | 'center' | 'right' | 'edge-left' | 'edge-right';
    edgeOffset?: number;
  }) {
    const isEdge = role === 'edge-left' || role === 'edge-right';
    const logicalRole: 'left' | 'center' | 'right' =
      role === 'edge-left' ? 'left' :
      role === 'edge-right' ? 'right' :
      role;

    const cardScale = scaleFor(logicalRole);
    const imgScale  = imgScaleFor(logicalRole);
    const shade     = shadeFor(logicalRole);

    const Article = (
      <article
        className={baseCard}
        style={{
          transform: `scale(${cardScale})`,
          transition: suppress ? 'none' : `transform ${DURATION}ms linear`,
          willChange: 'transform',
        }}
      >
        <div className="rounded-[inherit] overflow-hidden">
          {/* Zone image : ratio stable, jamais sur le texte */}
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
                transition: suppress ? 'none' : `transform ${DURATION}ms linear`,
                willChange: 'transform',
              }}
            />
            {/* Assombrissement latérales */}
            {logicalRole !== 'center' && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: '#000',
                  opacity: shade,
                  transition: suppress ? 'none' : `opacity ${DURATION}ms linear`,
                }}
              />
            )}
            {/* Dégradé bas vers le texte (lisibilité) */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-black/92 via-black/60 to-transparent"
              style={{ height: '58%' }}
            />
          </div>

          {/* Texte */}
          <div className="p-5">
            <h3 className="text-xl font-semibold">{data.name}</h3>
            <p className={'mt-2 text-sm leading-relaxed text-muted ' + (logicalRole === 'center' ? '' : ' line-clamp-1')}>
              {data.blurb}
            </p>
            <Link href={`/agents/${data.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
              Voir les détails →
            </Link>
          </div>
        </div>
      </article>
    );

    if (!isEdge) return Article;

    // Carte entrante (absolue)
    return (
      <div
        className="absolute top-0"
        style={{ width: slotW, left: edgeOffset }}
      >
        {Article}
      </div>
    );
  }

  // Séquence visible (left/center/right)
  const seq = useMemo(() => ([
    { key: `L-${idxLeft}`,   role: 'left'   as const, data: CARDS[idxLeft]   },
    { key: `C-${idxCenter}`, role: 'center' as const, data: CARDS[idxCenter] },
    { key: `R-${idxRight}`,  role: 'right'  as const, data: CARDS[idxRight]  },
  ]), [idxLeft, idxCenter, idxRight]);

  // Carte entrante (edge)
  const edgeRole: 'edge-left' | 'edge-right' = dir === -1 ? 'edge-left' : 'edge-right';
  const edgeIdx = dir === 0 ? mod(current + 2, n) : idxFar;

  // Placement absolu de l’edge
  const edgeOffset = edgeRole === 'edge-left'
    ? -(slotW + GAP)                          // à gauche, juste hors champ
    : (slotW * 3 + GAP * 2);                  // à droite, juste hors champ

  // Glisse de la scène (3 cartes visibles)
  const sceneTranslate = `translate3d(${sceneShift}px,0,0)`;

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

        {/* SCÈNE centrée : largeur exacte (3 slots + 2 gaps) */}
        <div
          ref={sceneRef}
          className="relative mx-auto overflow-visible"
          style={{ width: slotW ? `${3 * slotW + 2 * GAP}px` : '100%' }}
        >
          {/* Carte entrante (hors champ, glisse avec la scène) */}
          <Card data={CARDS[edgeIdx]} role={edgeRole} edgeOffset={edgeOffset} />

          {/* Trio visible — glisse ensemble */}
          <div
            className="relative flex items-stretch justify-between"
            style={{
              transform: sceneTranslate,
              transition: suppress ? 'none' : `transform ${DURATION}ms linear`,
              willChange: 'transform',
              gap: `${GAP}px`,
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
