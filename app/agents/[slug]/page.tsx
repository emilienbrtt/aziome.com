import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

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

export async function generateMetadata({ params }: { params: { slug: AgentKey } }): Promise<Metadata> {
  const a = AGENTS[params.slug];
  return { title: `${a?.name ?? 'Agent'} — Aziome` };
}

export default function AgentPage({ params }: { params: { slug: AgentKey } }) {
  const current = AGENTS[params.slug];
  const others = (Object.keys(AGENTS) as AgentKey[]).filter((k) => k !== params.slug);

  return (
    <section className="relative max-w-5xl mx-auto px-6 py-20">
      {/* halo décoratif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, var(--glow), transparent 60%)' }}
      />

      {/* back */}
      <div className="mb-8">
        <Link href="/#solutions" className="text-sm text-[color:var(--gold-1)] hover:opacity-90">
          ← Revenir aux agents
        </Link>
      </div>

      {/* hero */}
      <div className="glass rounded-2xl p-6 md:p-8 flex items-start gap-6">
        <Image
          src={current.avatar}
          alt={current.name}
          width={112}
          height={112}
          priority
          className="rounded-full ring-2 ring-[rgba(212,175,55,0.45)] shadow-[0_0_55px_rgba(212,175,55,0.35)] object-cover"
        />
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-semibold">{current.name}</h1>
          <p className="text-muted mt-1">{current.subtitle}</p>
          <p className="mt-4">{current.intro}</p>
        </div>
      </div>

      {/* details */}
      <div className="mt-8 grid md:grid-cols-3 gap-6 text-sm">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-medium mb-3">Pourquoi c’est utile</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted">
            {current.why.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-medium mb-3">Ça marche avec</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted">
            {current.stacks.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-medium mb-3">Ce que vous voyez</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted">
            {current.youSee.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA simple */}
      <div className="mt-8">
        <Link
          href="/#contact"
          className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                     bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition"
        >
          Parler de cet agent →
        </Link>
      </div>

      {/* suggestion rail */}
      <div className="mt-12">
        <h3 className="text-base font-medium mb-4">Explorer les autres agents</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {others.map((key) => {
            const a = AGENTS[key];
            return (
              <Link
                key={key}
                href={`/agents/${key}`}
                className="min-w-[220px] glass rounded-2xl p-4 flex items-center gap-3 hover:shadow-[0_0_55px_rgba(212,175,55,0.25)] transition-shadow"
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
