"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ChatCTA({ agentName }: { agentName: string }) {
  // On récupère le slug de l’URL courante /agents/[slug]
  const { slug } = useParams<{ slug: string }>();
  const href = `/chat/${slug}`;

  return (
    <Link
      href={href}
      // ✨ Bouton or + halo doré au survol/focus
      className="
        group relative inline-flex items-center
        rounded-xl px-4 py-2 text-sm font-medium text-black
        bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white
        shadow-[0_0_0_0_rgba(212,175,55,0)]
        hover:shadow-[0_0_34px_8px_rgba(212,175,55,0.35)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAD588]/60
        transition
      "
    >
      {/* glow supplémentaire pour les navigateurs qui gèrent mal la spread */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute inset-0 rounded-xl opacity-0
          group-hover:opacity-100 group-focus-visible:opacity-100
          transition shadow-[0_0_50px_8px_rgba(212,175,55,0.35)]
        "
      />
      {/* Pas d’uppercase → on affiche exactement le nom tel quel */}
      <span className="relative">Parler à {agentName}</span>
    </Link>
  );
}
