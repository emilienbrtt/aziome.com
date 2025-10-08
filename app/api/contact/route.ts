import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO = process.env.CONTACT_TO || 'aziom.agency@gmail.com';
const CONTACT_FROM = process.env.CONTACT_FROM || 'Aziome <noreply@aziome.com>';

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#039;'}[c] as string));
}

export async function POST(req: Request) {
  try {
    const { name, email, company = '', agent = '', message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'Configuration manquante (RESEND_API_KEY)' }, { status: 500 });
    }

    const subject = `[Contact] ${agent ? `Agent ${agent} — ` : ''}${name} <${email}>`;
    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;line-height:1.5;font-size:14px">
        <h2 style="margin:0 0 8px">Nouveau message depuis le site</h2>
        <p><b>Nom</b> : ${escapeHtml(name)}</p>
        <p><b>Email</b> : ${escapeHtml(email)}</p>
        ${company ? `<p><b>Entreprise</b> : ${escapeHtml(company)}</p>` : ''}
        ${agent ? `<p><b>Agent</b> : ${escapeHtml(agent)}</p>` : ''}
        <p><b>Message</b> :</p>
        <pre style="white-space:pre-wrap;background:#0b0b0b;color:#fff;padding:12px;border-radius:10px">${escapeHtml(message)}</pre>
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
        to: CONTACT_TO,
        subject,
        html,
        reply_to: email,
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      console.error('Resend error:', t);
      return NextResponse.json({ error: 'Échec envoi' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
