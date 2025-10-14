"use client";
import Link from "next/link";

export default function ChatCTA({ agentName }: { agentName: "Max" | "Léa" | "Jules" | "Mia" | "Chris" }) {
  const slug = ({ "Léa": "lea" } as Record<string, string>)[agentName] ?? agentName.toLowerCase();
  return (
    <Link
      href={`/agents/${slug}/chat`}
      className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                 bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition"
    >
      Parler à cet agent →
    </Link>
  );
}
