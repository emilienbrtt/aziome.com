import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChatCTA from './ChatCTA';

type AgentKey = 'max' | 'lea' | 'jules' | 'mia' | 'chris';

const AGENTS: Record<
  AgentKey,
  {
    name: 'Max' | 'Léa' | 'Jules' | 'Mia' | 'Chris';
    subtitle: string;
    avatar: string;
    intro: string;
    why: string[];
    stacks: string[];
    youSee: string[];
  }
> = {
  max: {
    name: 'Max',
    subtitle: 'CRM & Relances',
    avatar: '/agents/max.png',
    intro:
      'Récupère les paniers abandonnés, relance au bon moment et s’arrête dès que le client répond.',
    why: ['Vous récupérez des ventes perdues.', 'Plus de clients reviennent acheter.', 'Messages clairs, au bon moment.'],
    stacks: ['Email, SMS, WhatsApp', 'Shopify, Stripe', 'Klaviyo, Mailchimp, HubSpot'],
    youSee: ['Ventes récupérées', 'Taux d’ouverture et de réponse', 'Clients réactivés'],
  },
  lea: {
    name: 'Léa',
    subtitle: 'Service après-vente (SAV)',
    avatar: '/agents/lea.png',
    intro:
      'Répond vite et clairement, suit les commandes et transfère à un humain si besoin.',
    why: ['Moins d’attente pour vos clients', 'Moins de charge pour l’équipe', 'Vous gardez la main à tout moment'],
    stacks: ['Email, chat, WhatsApp', 'Gorgias, Zendesk, Freshdesk', 'Shopify, WooCommerce'],
    youSee: ['Temps de réponse moyen', 'Demandes résolues par l’agent', 'Satisfaction client'],
  },
  jules: {
    name: 'Jules',
    subtitle: 'Reporting & Résultats',
    avatar: '/agents/jules.png',
    intro:
      'Met vos chiffres sur une page simple, alerte en cas d’anomalie, répond aux questions (“Combien hier ?”).',
    why: ['Vous savez où vous en êtes chaque jour', 'Vous repérez les soucis tout de suite', 'Moins de fichiers, plus de clarté'],
    stacks: ['Shopify / WooCommerce', 'Gorgias / Zendesk', 'Google Sheets, Looker, Notion'],
    youSee: ['Tableau à jour', 'Alertes email / Slack', 'Résumé hebdomadaire'],
  },
  mia: {
    name: 'Mia',
    subtitle: 'Premier contact & Orientation',
    avatar: '/agents/mia.png',
    intro:
      'Accueille chaque demande, pose les bonnes questions et oriente vers la bonne personne.',
    why: ['Réponses immédiates, 24h/24', 'Moins d’appels ou emails perdus', 'Parcours client plus fluide'],
    stacks: ['Chat du site, formulaire, email', 'WhatsApp, Facebook/Instagram', 'Transcriptions d’appels, Slack'],
    youSee: ['Demandes prises en charge', 'Catégories & motifs récurrents', 'Taux de transfert vers humain'],
  },
  chris: {
    name: 'Chris',
    subtitle: 'Démarches RH & Support interne',
    avatar: '/agents/chris.png',
    intro:
      'Prend en charge les demandes internes (attestations, absences), prépare les documents et répond aux questions.',
    why: ['Moins d’administratif pour les RH', 'Réponses rapides pour les équipes', 'Moins d’erreurs et de retards'],
    stacks: ['Google Workspace/Drive, Notion', 'Slack ou Microsoft Teams', 'Outils SIRH (placeholders)'],
    youSee: ['Demandes traitées', 'Documents générés', 'Délai moyen de réponse'],
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug?: AgentKey; limace?: AgentKey };
}): Promise<Metadata> {
  const key = (params.slug ?? params.limace) as AgentKey | undefined;
  const a = key ? AGENTS[key] : undefined;
  return { title: `${a?.name ?? 'Agent'} — Aziome` };
}

export default function AgentPage({
  params,
}: {
  params: { slug?: AgentKey; limace?: AgentKey };
}) {
  const key = (params.slug ?? params.limace) as AgentKey | undefined;
  const current = key ? AGENTS[key] : undefined;
  if (!current) return notFound();

  const others = (Object.keys(AGENTS) as AgentKey[]).filter((k) => k !== key);

  return (
    <section className="relative max-w-6xl mx-auto px-6 pt-10 md:pt-20 pb-16 md:pb-20">
      {/* halo discret */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.16), transparent 60%)' }}
      />

      {/* back */}
      <div className="mb-6 md:mb-8">
        <Link href="/agents" className="text-sm text-[color:var(--gold-1)] hover:opacity-90" style={{ WebkitTapHighlightColor: 'transparent' }}>
          ← Revenir aux agents
        </Link>
      </div>

      {/* HERO : visuel gauche / infos droite */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        <div className="relative h-[400px] sm:h-[480px] md:h-[620px]">
          <Image
            src={current.avatar}
            alt={current.name}
            fill
            priority
            className="object-contain select-none pointer-events-none transform
                       translate-y-[-96px] md:translate-y-[6px]
                       scale-[1.34] md:scale-[1.28]"
            style={{ objectPosition: 'center bottom' }}
          />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">{current.name}</h1>
          <p className="text-muted mt-1">{current.subtitle}</p>
          <p className="mt-5 text-base leading-relaxed text-white/90">{current.intro}</p>

          <div className="mt-8">
            {/* 👉 bouton qui ouvre le chat avec le bon agent */}
            <ChatCTA agentName={current.name} />
          </div>
        </div>
      </div>

      {/* Détails */}
      <div className="mt-10 grid md:grid-cols-3 gap-6 text-sm">
        <Card title="Pourquoi c’est utile" items={current.why} />
        <Card title="Ça marche avec" items={current.stacks} />
        <Card title="Ce que vous voyez" items={current.youSee} />
      </div>

      {/* Autres agents */}
      <div className="mt-12">
        <h3 className="text-base font-medium mb-4">Explorer les autres agents</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {others.map((k) => {
            const a = AGENTS[k];
            return (
              <Link
                key={k}
                href={`/agents/${k}`}
                className="min-w-[220px] glass rounded-2xl p-4 flex items-center gap-3 hover:shadow-[0_0_55px_rgba(212,175,55,0.25)] transition-shadow"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Image
                  src={a.avatar}
                  alt={a.name}
                  width={40}
                  height={40}
                  className="rounded-full ring-1 ring-white/10 object-cover"
                />
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-muted">{a.subtitle}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* — sous-composant — */
function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="font-medium mb-3">{title}</h2>
      <ul className="list-disc pl-5 space-y-1 text-muted">
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  );
}
