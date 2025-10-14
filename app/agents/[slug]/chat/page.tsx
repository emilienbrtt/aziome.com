import type { Metadata } from 'next';
import Link from 'next/link';
import AgentChat from './AgentChat';

type AgentKey = 'max' | 'lea' | 'jules' | 'mia' | 'chris';

const NAMES: Record<AgentKey, string> = {
  max: 'Max',
  lea: 'Léa',
  jules: 'Jules',
  mia: 'Mia',
  chris: 'Chris',
};

export function generateMetadata({ params }: { params: { slug: AgentKey } }): Metadata {
  const label = NAMES[params.slug] ?? 'Agent';
  return { title: `Parler à ${label} — Aziome` };
}

export default function ChatPage({ params }: { params: { slug: AgentKey } }) {
  const { slug } = params;

  return (
    <section className="relative max-w-4xl mx-auto px-6 pt-10 md:pt-14 pb-16 md:pb-20">
      {/* halo discret */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.16), transparent 60%)' }}
      />

      {/* back -> retourne à la fiche de l’agent */}
      <div className="mb-6 md:mb-8">
        <Link href={`/agents/${slug}`} className="text-sm text-[color:var(--gold-1)] hover:opacity-90">
          ← Revenir à {NAMES[slug]}
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Parler à {NAMES[slug]}</h1>
      <p className="text-muted mb-6">Posez vos questions, {NAMES[slug]} vous répond.</p>

      {/* ⬇️ On passe bien la prop `agent` */}
      <AgentChat agent={slug} />
    </section>
  );
}
