'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CardDef = {
  slug: string;
  name: 'Max' | 'Léa' | 'Jules' | 'Mia' | 'Chris';
  image: string;
  blurb: string;
};

const DATA: CardDef[] = [
  { slug: 'max',   name: 'Max',   image: '/agents/max.png',   blurb: "Relance les clients au bon moment et récupère des ventes perdues." },
  { slug: 'lea',   name: 'Léa',   image: '/agents/lea.png',   blurb: "Répond vite, suit les commandes et passe à l’humain si besoin." },
  { slug: 'jules', name: 'Jules', image: '/agents/jules.png', blurb: "Réunit vos chiffres et vous alerte quand quelque chose cloche." },
  { slug: 'mia',   name: 'Mia',   image: '/agents/mia.png',   blurb: "Accueil instantané : pose les bonnes questions et oriente bien." },
  { slug: 'chris', name: 'Chris', image: '/agents/chris.png', blurb: "Gère les demandes internes et la paperasse sans retard." },
];

const DURATION = 700; // ms
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function Solutions() {
  // On duplique la liste pour faire une boucle sans à-coups (… A B C … A B C …)
  const items = useMemo(() => [...DATA, ...DATA, ...DATA], []);
  const block = DATA.length; // taille de la séquence originale

  // centre logique = milieu du bloc dupliqué
  const startIndex = block; // on démarre pile au 2e bloc pour pouvoir glisser des deux côtés
  const [index, setIndex] = useState(startIndex);
  const [animating, setAnimating] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);

  // Pour le swipe mobile
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? next() : prev();
  };

  const next = () => {
    if (animating) return;
    setAnimating(true);
    setIndex((i) => i + 1);
  };

  const prev = () => {
    if (animating) return;
    setAnimating(true);
    setIndex((i) => i - 1);
  };

  // Quand l’anim se termine, on “replie” l’index dans le bloc central (pour l’infini)
  useEffect(() => {
    if (!animating) return;
    const t = setTimeout(() => {
      setAnimating(false);
      setIndex((i) => {
        let j = i;
        if (j >= startIndex + block) j -= block;
        if (j < startIndex) j += block;
        return j;
      });
    }, DURATION + 20);
    return () => clearTimeout(t);
  }, [animating, block, startIndex]);

  // Calcule les 5 cartes visibles autour du centre (pour que la transition soit très douce)
  // positions: [left2, left1, center, right1, right2]
  const visible = useMemo(() => {
    const arr: { card: CardDef; offset: number }[] = [];
    for (let k = -2; k <= 2; k++) {
      arr.push({ card: items[index + k], offset: k });
    }
    return arr;
  }, [items, index]);

  // largeur d’une carte (en %) + l’espace entre cartes
  const CARD_W = 32;   // % du conteneur (proche de ton 32vw desktop)
  const GAP = 3;       // % d’écart
  const STEP = CARD_W + GAP; // translation d’un cran

  // TranslateX global du track (au lieu de repositionner chaque carte, plus fluide)
  const translate = -STEP * 2; // on centre la 3e carte (offset 0) dans la fenêtre de 5 cartes

  // style commun bordures (blanc discret au repos, doré au hover)
  const cardBorder =
    'rounded-2xl border bg-[#0b0b0b] border-white/12 ' +
    'hover:border-[rgba(212,175,55,0.45)] ' +
    'hover:shadow-[0_0_120px_rgba(212,175,55,0.22)] ' +
    'transition-[border-color,box-shadow]';

  // timeline visuelle (scale + ombres latérales)
  const getVisual = (offset: number) => {
    // centre plus grand; latérales un peu plus petites + assombries
    const scale =
      offset === 0 ? 1.0 :
      Math.abs(offset) === 1 ? 0.92 : 0.88;

    const shade =
      offset === 0 ? 0 :
      Math.abs(offset) === 1 ? 0.14 : 0.22;

    // image plus grande au centre
    const imgScale =
      offset === 0 ? 1.18 :
      Math.abs(offset) === 1 ? 1.08 : 1.04;

    return { scale, shade, imgScale };
  };

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="relative py-10" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Flèches */}
        <button
          onClick={prev}
          className="hidden sm:flex items-center justify-center
                     absolute left-[-16px] lg:left-[-22px] top-1/2 -translate-y-1/2 z-30
                     h-12 w-12 rounded-full border border-white/15 bg-white/7
                     hover:bg-white/12 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={next}
          className="hidden sm:flex items-center justify-center
                     absolute right-[-16px] lg:right-[-22px] top-1/2 -translate-y-1/2 z-30
                     h-12 w-12 rounded-full border border-white/15 bg-white/7
                     hover:bg-white/12 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Fenêtre : overflow visible pour laisser respirer le glow */}
        <div className="relative mx-auto h-[600px] sm:h-[620px] lg:h-[640px] overflow-visible">
          {/* Track : 5 cartes visibles, qui glissent toutes ensemble */}
          <div
            ref={trackRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 flex"
            style={{
              gap: `${GAP}%`,
              width: `${5 * CARD_W + 4 * GAP}%`,
              transform: `translateX(${translate + (animating ? (index > startIndex ? -STEP : STEP) : 0)}%)`,
              transition: animating ? `transform ${DURATION}ms ${EASE}` : undefined,
            }}
          >
            {visible.map(({ card, offset }, i) => {
              const { scale, shade, imgScale } = getVisual(offset);
              return (
                <article
                  key={`${card.slug}-${i}-${index}`}
                  className={cardBorder}
                  style={{
                    width: `${CARD_W}%`,
                    transform: `scale(${scale})`,
                    transition: `transform ${DURATION}ms ${EASE}, box-shadow ${DURATION}ms ${EASE}, border-color ${DURATION}ms ${EASE}`,
                  }}
                >
                  <div className="rounded-[inherit] overflow-hidden">
                    <div className="relative aspect-[4/5] w-full bg-black">
                      <Image
                        src={card.image}
                        alt={card.name}
                        fill
                        priority
                        sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
                        className={`object-contain object-bottom select-none`}
                        style={{
                          transform: `scale(${imgScale})`,
                          transition: `transform ${DURATION}ms ${EASE}`,
                        }}
                      />
                      {/* assombrissement latérales */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.12))',
                          opacity: shade,
                          transition: `opacity ${DURATION}ms ${EASE}`,
                        }}
                      />
                      {/* dégradé bas vers le texte */}
                      <div
                        className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-black/92 via-black/60 to-transparent"
                        style={{ height: '58%' }}
                      />
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-semibold">{card.name}</h3>
                      <p className={'mt-2 text-sm leading-relaxed text-muted ' + (offset === 0 ? '' : ' line-clamp-1')}>
                        {card.blurb}
                      </p>
                      <Link href={`/agents/${card.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
                        Voir les détails →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-3 md:hidden text-center text-xs text-muted">
          Balayez pour changer d’agent
        </div>
      </div>
    </section>
  );
}
