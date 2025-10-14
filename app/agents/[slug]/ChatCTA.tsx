"use client";

import type { MouseEvent } from "react";
import type { AgentKey } from "../../../config"; // config.ts à la racine

// mapping pour accepter agentName "Max" | "Lea" | "Jules" | "Mia" | "Chris"
const NAME_TO_SLUG: Record<string, AgentKey> = {
  max: "max",
  lea: "lea",
  jules: "jules",
  mia: "mia",
  chris: "chris",
};

type Props = {
  /** Recommandé : passe directement le slug minuscule */
  slug?: AgentKey;
  /** Optionnel : si ta page envoie un nom type "Max" */
  agentName?: string;
  /** Optionnel : pour surcharger le texte du bouton */
  label?: string;
  /** Optionnel : classes Tailwind perso */
  className?: string;
};

export default function ChatCTA({ slug, agentName, label, className }: Props) {
  // 1) priorité au slug, sinon on convertit agentName -> slug, sinon fallback "max"
  const key: AgentKey =
    slug ??
    NAME_TO_SLUG[(agentName ?? "").trim().toLowerCase()] ??
    "max";

  function open(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("aziome:open-chat", { detail: { agent: key } })
    );
  }

  return (
    <button
      onClick={open}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15"
      }
    >
      {label ?? `Parler à ${key.toUpperCase()}`}
    </button>
  );
}
