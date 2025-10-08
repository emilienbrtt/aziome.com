'use client';
import Link from 'next/link';

export default function ChatCTA({ agentName }: { agentName: string }) {
  const subject = `Parler de l’agent ${agentName}`;
  const body =
    `Bonjour,\n\n` +
    `Je souhaite parler de l’agent ${agentName}.\n\n` +
    `Nom :\nEntreprise :\nMessage :\n`;

  const href = `mailto:aziome.agency@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="mt-6">
      <Link
        href={href}
        className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                   bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white
                   shadow hover:shadow-lg transition"
      >
        Parler de cet agent →
      </Link>
    </div>
  );
}
