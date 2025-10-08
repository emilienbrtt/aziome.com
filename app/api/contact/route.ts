import { NextResponse } from 'next/server';

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] as string
  ));
}

export async function POST(req: Request) {
  try {
    const { name = '', email = '', company = '', agent = '', message = '' } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Champs requis manquants' }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO = process.env.CONTACT_TO;                 // ex: team@aziome.com
    const CONTACT_FROM = process.env.CONTACT_FROM || 'Aziome <noreply@aziome.com>';

    if (!RESEND_API_KEY || !CONTACT_TO) {
      return NextResponse.json(
        { ok: false, error: 'CONFIG manquante (RESEND_API_KEY / CONTACT_TO)' },
        { status: 500 }
      );
    }

    const subject = `[Contact] ${agent ? `Agent ${agent} — ` : ''}${name} <${email}>`;

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto;line-height:1.5">
        <h2 style="margin:0 0 8px 0">Nouveau message depuis le site</h2>
        <p><b>Nom</b>: ${escapeHtml(name)}<br/>
           <b>Email</b>: ${escapeHtml(email)}<br/>
           <b>Entreprise</b>: ${escapeHtml(company)}<br/>
           <b>Agent</b>: ${escapeHtml(agent)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `.trim();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        subject,
        html,
        reply_to: email, // vous pourrez répondre directement à l’expéditeur
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ ok: false, error: text }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
