"use client";

export default function ChatCTA({ agentName }: { agentName: "Max" | "Léa" | "Jules" | "Mia" | "Chris" }) {
  function openAgentChat(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const key = agentName.toLowerCase() as "max" | "lea" | "jules" | "mia" | "chris";
    window.dispatchEvent(new CustomEvent("aziome:open-chat", { detail: { agent: key } }));
  }

  return (
    <div className="mt-8">
      <button
        onClick={openAgentChat}
        className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                   bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg transition"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        Parler à cet agent →
      </button>
    </div>
  );
}
