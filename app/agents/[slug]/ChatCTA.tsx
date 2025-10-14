"use client";

import type { MouseEvent } from "react";
import type { AgentKey } from "../../../config"; // ← CORRECT

export default function ChatCTA({ slug }: { slug: AgentKey }) {
  function open(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("aziome:open-chat", { detail: { agent: slug } })
    );
  }

  return (
    <button
      onClick={open}
      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15"
    >
      Parler à {slug.toUpperCase()}
    </button>
  );
}
