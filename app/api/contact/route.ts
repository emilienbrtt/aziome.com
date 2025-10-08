import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CONTACT_TO      = (process.env.CONTACT_TO || 'aziome.agency@gmail.com').trim();
const CONTACT_FROM    = (process.env.CONTACT_FROM || 'Aziome <onboarding@resend.dev>').trim();

export async function POST(req: Request) {
  try {
    const { name, email, company = '', agent = '', message = '' } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY manquante.' }, { status: 500 });
    }

    // Nettoie/valide la ou les adresses destinataires
    const toList = CONTACT_TO
      .split(',')               // autorise une liste séparée par des virgules si tu en mets plusieurs
      .map(s => s.trim())
      .filter(Boolean);

    if (toList.length === 0 || !toList[0].includes('@')) {
      return NextResponse.json({ error: 'CONTACT_TO invalide.' }, { status: 500 });
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
      </div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM,      // temporairement onboarding@resend.dev
        to: toList,              // <-- le "to" est bien un tableau d’adresses
        subject,
        html,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur.' }, { status: 500 });
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
