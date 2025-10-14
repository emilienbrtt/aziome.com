"use client";
import Link from "next/link";
import type { AgentKey } from "../../../config";

const NAME_TO_SLUG: Record<string, AgentKey> =
  { max:"max", lea:"lea", jules:"jules", mia:"mia", chris:"chris" };

type Props = { slug?: AgentKey; agentName?: string; label?: string; className?: string; };

export default function ChatCTA({ slug, agentName, label, className }: Props) {
  const key: AgentKey = slug ?? NAME_TO_SLUG[(agentName ?? "").toLowerCase()] ?? "max";
  return (
    <Link
      href={`/chat/${key}`}
      className={className ?? "inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15"}
    >
      {label ?? `Parler à ${key.toUpperCase()}`}
    </Link>
  );
}
