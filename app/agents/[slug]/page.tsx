// app/agents/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { AgentKey } from "@/config";
import { AGENTS } from "@/config";

export default function AgentDetailsPage({ params }: { params: { slug: AgentKey } }) {
  const agent = AGENTS[params.slug];
  if (!agent) return notFound();

  // Nom court pour le bouton
  const shortName = agent.name;

  return (
    <section className="relative max-w-6xl mx-auto px-6 pt-12 md:pt-16 pb-16 md:pb-20">
      {/* halo discret */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-25 blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.16), transparent 60%)" }}
      />

      {/* back */}
      <div className="mb-6 md:mb-8">
        <Link href="/#solutions" className="text-sm text-[color:var(--gold-1)] hover:opacity-90">
          ← Revenir aux agents
        </Link>
      </div>

      {/* HERO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        {/* Visuel */}
        <div className="relative h-[460px] sm:h-[520px] md:h-[560px] lg:h-[600px]">
          <Image
            src={agent.avatar}
            alt={agent.name}
            fill
            priority
            className="object-contain select-none pointer-events-none"
            style={{ objectPosition: "center center" }}
          />
        </div>

        {/* Infos + CTA */}
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">{agent.name}</h1>
          <p className="text-muted mt-1">{agent.subtitle}</p>
          <p className="mt-5 text-base leading-relaxed text-white/90">{agent.intro}</p>

          <div className="mt-6">
            <Link
              href={`/chat/${params.slug}`}
              className="
                inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black
                bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white
                ring-1 ring-white/10 shadow-[0_0_50px_rgba(212,175,55,0.30)]
                hover:shadow-[0_0_80px_rgba(212,175,55,0.38)] transition
              "
            >
              Parler à {shortName}
            </Link>
          </div>
        </div>
      </div>

      {/* Détails */}
      <div className="mt-12 md:mt-14 grid md:grid-cols-3 gap-6 text-sm">
        <InfoCard title="Pourquoi c’est utile" items={agent.why} />
        <InfoCard title="Ça marche avec" items={agent.stacks} />
        <InfoCard title="Ce que vous voyez" items={agent.youSee} />
      </div>
    </section>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
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
