// app/agents/[slug]/chat/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import AgentChat from "./AgentChat";

type AgentKey = "max" | "lea" | "jules" | "mia" | "chris";

const NAME: Record<AgentKey, string> = {
  max: "Max",
  lea: "Léa",
  jules: "Jules",
  mia: "Mia",
  chris: "Chris",
};

export function generateMetadata({ params }: { params: { slug: AgentKey } }): Metadata {
  const title = NAME[params.slug] ? `Parler à ${NAME[params.slug]} — Aziome` : "Parler à un agent — Aziome";
  return { title };
}

export default function AgentChatPage({ params }: { params: { slug: AgentKey } }) {
  const slug = params.slug;
  const display = NAME[slug] ?? "Agent";

  return (
    <section className="relative max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-16">
      {/* halo discret */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-20 blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.16), transparent 60%)" }}
      />

      {/* retour vers la fiche agent */}
      <div className="mb-6">
        <Link href={`/agents/${slug}`} className="text-sm text-[color:var(--gold-1)] hover:opacity-90">
          ← Revenir à {display}
        </Link>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold mb-2">Parler à {display}</h1>
      <p className="text-muted mb-6">Posez vos questions, {display} vous répond.</p>

      <AgentChat agent={slug} />
    </section>
  );
}
