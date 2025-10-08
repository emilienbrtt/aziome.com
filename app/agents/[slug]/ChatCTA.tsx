'use client';
import Link from 'next/link';

export default function ChatCTA({ agentName }: { agentName: string }) {
  return (
    <div className="mt-6">
      <Link
        href={`/contact?agent=${encodeURIComponent(agentName)}`}
        className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                   bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white
                   shadow hover:shadow-lg transition"
      >
        Parler de cet agent →
      </Link>
    </div>
  );
}
