// app/api/contact/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';            // exécute sur l’edge
export const dynamic = 'force-dynamic';   // jamais mis en cache

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const CONTACT_TO   = (process.env.CONTACT_TO   ?? 'aziome.agency@gmail.com').trim();
// ✨ IMPORTANT : fallback sur un expéditeur de TON domaine vérifié
const CONTACT_FROM = (process.env.CONTACT_FROM ?? 'Aziome <no-reply@aziome.com>').trim();

function isEmail(x: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
}

function escapeHtml(str: string) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function POST(req: Request) {
  try {
    const { name = '', email = '', company = '', agent = '', message = '' } =
      (await req.json().catch(() => ({}))) as Record<string, string>;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ error: "Format d'email invalide." }, { status: 400 });
    }
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY manquante.' }, { status: 500 });
    }

    // Liste des destinataires (séparée par virgules possible)
    const toList = CONTACT_TO.split(',').map(s => s.trim()).filter(Boolean);
    if (toList.length === 0 || !toList.every(isEmail)) {
      return NextResponse.json({ error: 'CONTACT_TO invalide.' }, { status: 500 });
    }

    // Sécurité : on s’assure que le FROM est bien sur le domaine vérifié
    if (!/@aziome\.com>/i.test(CONTACT_FROM) && !/@aziome\.com$/i.test(CONTACT_FROM)) {
      return NextResponse.json(
        { error: "CONTACT_FROM doit être une adresse @aziome.com." },
        { status: 500 }
      );
    }

    const subject = `[Contact] ${agent ? `Agent ${agent} — ` : ''}${name} <${email}>`;
    const html = `
      <div style="font-family:ui-sans-serif,sans-serif;line-height:1.5">
        <h2 style="margin:0 0 8px">Nouveau message depuis le site</h2>
        <p><b>Nom</b> : ${escapeHtml(name)}</p>
        <p><b>Email</b> : ${escapeHtml(email)}</p>
        ${company ? `<p><b>Entreprise</b> : ${escapeHtml(company)}</p>` : ''}
        ${agent ? `<p><b>Agent</b> : ${escapeHtml(agent)}</p>` : ''}
        <p style="white-space:pre-wrap"><b>Message</b><br>${escapeHtml(message)}</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM,     // ✅ expéditeur @aziome.com
        to: toList,             // tableau d’adresses
        subject,
        html,
        reply_to: email,        // répond directement à l’expéditeur saisi dans le form
      }),
    });

    if (!res.ok) {
      let info: unknown;
      try { info = await res.json(); } catch { info = await res.text(); }
      return NextResponse.json({ error: info }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, id: (data as any)?.id ?? null });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Erreur serveur.' }, { status: 500 });
  }
}
