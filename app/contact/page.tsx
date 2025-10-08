import ContactClient from './ContactClient';

export default function Page({ searchParams }: { searchParams: { agent?: string } }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold mb-2">
        Parler de l’agent {searchParams.agent ?? ''}
      </h1>
      <p className="text-muted mb-6">
        Dites-nous ce dont vous avez besoin, on vous répond rapidement.
      </p>

      <ContactClient defaultAgent={searchParams.agent ?? ''} />
    </section>
  );
}
