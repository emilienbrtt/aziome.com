'use client';

import Card from './Card';
import Image from 'next/image';
import Link from 'next/link';

type CardDef = {
  slug: string;
  title: 'Max' | 'Léa' | 'Jules' | 'Mia' | 'Chris';
  bullets: string[];
  layout: string;
};

function Avatar({ name, size = 36, glow = false }: { name: string; size?: number; glow?: boolean }) {
  const map: Record<string, string> = {
    Max: '/agents/max.png',
    'Léa': '/agents/lea.png',
    Jules: '/agents/jules.png',
    Mia: '/agents/mia.png',
    Chris: '/agents/chris.png',
  };
  return (
    <Image
      src={map[name]}
      alt={name}
      width={size}
      height={size}
      priority
      className={[
        'rounded-full object-cover',
        glow ? 'ring-2 ring-[rgba(212,175,55,0.45)] shadow-[0_0_35px_rgba(212,175,55,0.28)]' : 'ring-1 ring-white/10',
      ].join(' ')}
    />
  );
}

export default function Solutions() {
  const cards: CardDef[] = [
    {
      slug: 'max',
      title: 'Max',
      bullets: ["Assure le suivi de vos clients et envoie des rappels personnalisés pour n'oublier personne."],
      layout: 'lg:col-span-4 lg:col-start-1',
    },
    {
      slug: 'lea',
      title: 'Léa',
      bullets: ['Automatise votre service après-vente (SAV).'],
      layout: 'lg:col-span-4 lg:col-start-5',
    },
    {
      slug: 'jules',
      title: 'Jules',
      bullets: ['Regroupe vos chiffres clés et vous alerte si besoin.'],
      layout: 'lg:col-span-4 lg:col-start-9',
    },
    {
      slug: 'mia',
      title: 'Mia',
      bullets: [
        "Premier contact de votre entreprise : accueille chaque demande et oriente vers la bonne personne.",
      ],
      layout: 'lg:col-span-4 lg:col-start-3',
    },
    {
      slug: 'chris',
      title: 'Chris',
      bullets: ['Prend en charge les démarches RH et le support interne, sans paperasse.'],
      layout: 'lg:col-span-4 lg:col-start-7',
    },
  ];

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-10">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
        {cards.map(({ slug, title, bullets, layout }) => (
          <div
            key={slug}
            className={`${layout} relative rounded-2xl transition-[transform,box-shadow,ring-color] duration-300
                        hover:-translate-y-0.5
                        hover:shadow-[0_0_90px_rgba(212,175,55,0.35)]
                        hover:ring-2 hover:ring-[rgba(212,175,55,0.28)] ring-inset focus-visible:outline-none`}
          >
            <Card>
              <div className="flex items-start gap-3 h-full min-h-[120px] md:min-h-[130px]">
                <Avatar name={title} size={36} />
                <div className="flex-1 flex flex-col pb-0.5">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <ul className="mt-1.5 text-sm text-muted list-disc pl-4 space-y-0.5">
                    {bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                  <Link
                    href={`/agents/${slug}`}
                    className="text-sm mt-2 inline-block text-[color:var(--gold-1)]"
                  >
                    Voir le détail →
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
