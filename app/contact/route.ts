import { NextResponse } from 'next/server';

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  try {
    const { name, email, company = '', agent = '', message } = await req.json();

    if (!name || !email || !message) {
      return new NextResponse('Champs requis manquants', { status: 400 });
    }

    // À qui on envoie
    const CONTACT_TO = process.env.CONTACT_TO || 'aziome.agency@gmail.com';

    // Envoi via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return new NextResponse('CONFIG manquante (RESEND_API_KEY)', { status: 500 });
    }

    const subject = `[Contact] ${agent ? `Agent ${agent} — ` : ''}${name} <${email}>`;

    const html = `
      <div style="font-family:ui,sans-serif;line-height:1.55">
        <h2 style="margin:8px 0">Nouveau message depuis le site</h2>
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
        from: 'Aziome <noreply@aziome.com>',
        to: [CONTACT_TO],
        subject,
        html,
        reply_to: [email], // 👉 tu pourras répondre directement à l’expéditeur
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      return new NextResponse(`Échec Resend: ${t}`, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(`Erreur serveur: ${e?.message || e}`, { status: 500 });
  }
}
