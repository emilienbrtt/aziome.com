// application/contact/page.tsx
import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact — Aziome',
  description: "Parler d'un agent IA, poser une question, demander une démo.",
};

export default function Page({
  searchParams,
}: {
  searchParams?: { agent?: string | string[] };
}) {
  const raw = searchParams?.agent;
  const agent =
    typeof raw === 'string' ? raw.trim() : Array.isArray(raw) ? raw[0] ?? '' : '';
  return <ContactClient agent={agent} />;
}
