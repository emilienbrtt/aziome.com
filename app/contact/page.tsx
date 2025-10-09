import Link from 'next/link';
import ContactClient from './ContactClient';

export default function Page({ searchParams }: { searchParams: { agent?: string } }) {
  const agent = searchParams.agent ?? '';
  const title = agent ? `Parler de l’agent ${agent}` : 'Parler d’un agent';

  return (
    <section className="relative max-w-2xl mx-auto px-6 py-10 md:py-16">
      {/* Bouton retour */}
      <div className="mb-6">
        <Link href="/agents" className="text-sm text-[color:var(--gold-1)] hover:opacity-90">
          ← Revenir aux agents
        </Link>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold">{title}</h1>
      <p className="text-muted mt-1">Dites-nous ce dont vous avez besoin. On vous répond rapidement.</p>

      <div className="mt-6">
        <ContactClient defaultAgent={agent} />
      </div>
    </section>
  );
}
