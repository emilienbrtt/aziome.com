import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, company = '', agent = '', message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO = process.env.CONTACT_TO || 'team@aziome.com';
    const CONTACT_FROM = process.env.CONTACT_FROM || 'Aziome <no-reply@aziome.com>';

    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY manquant');
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 });
    }

    const html = `
      <div style="font-family:ui-sans-serif,sans-serif;line-height:1.5">
        <h2 style="margin:8px 0">Nouveau message depuis le site</h2>
        <p><b>Nom</b>: ${escapeHtml(name)}</p>
        <p><b>Email</b>: ${escapeHtml(email)}</p>
        <p><b>Entreprise</b>: ${escapeHtml(company)}</p>
        <p><b>Agent</b>: ${escapeHtml(agent)}</p>
        <p style="white-space:pre-wrap"><b>Message</b>: ${escapeHtml(message)}</p>
      </div>
    `;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        subject: `[Contact] ${agent ? `[${agent}] ` : ''}${name} — ${email}`,
        html,
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return NextResponse.json({ error: 'Erreur envoi', details: t }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;' }[m] as string));
}
