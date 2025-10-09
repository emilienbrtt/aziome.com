'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import ContactClient from './ContactClient';

// Transforme "Léa" -> "lea", "Max" -> "max", etc.
function toSlug(name?: string | null) {
  if (!name) return null;
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const agent = searchParams.get('agent') ?? '';
  const slug = toSlug(agent);
  const fallback = slug ? `/agents/${slug}` : '/#solutions';
  const title = agent ? `Parler de l’agent ${agent}` : 'Parler d’un agent';

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();                   // revient vraiment à la page précédente
    } else {
      router.push(fallback);           // sinon, renvoie vers la bonne fiche agent
    }
  };

  return (
    <section className="relative max-w-2xl mx-auto px-6 py-10 md:py-16">
      {/* Bouton retour */}
      <div className="mb-6">
        <button
          onClick={goBack}
          className="text-sm text-[color:var(--gold-1)] hover:opacity-90"
        >
          ← Revenir
        </button>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold">{title}</h1>
      <p className="text-muted mt-1">
        Dites-nous ce dont vous avez besoin. On vous répond rapidement.
      </p>

      <div className="mt-6">
        <ContactClient defaultAgent={agent} />
      </div>
    </section>
  );
}
