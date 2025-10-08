import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, company = '', agent = '', message } = await req.json();

    if (!name || !email || !message) {
      return new NextResponse('Champs requis manquants', { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO     = process.env.CONTACT_TO;     // ex: "team@aziome.com"
    const CONTACT_FROM   = process.env.CONTACT_FROM || 'Aziome <noreply@aziome.com>';

    if (!RESEND_API_KEY || !CONTACT_TO) {
      return new NextResponse('CONFIG manquante (RESEND_API_KEY / CONTACT_TO)', { status: 500 });
    }

    const subject = `[Contact] ${agent ? `[${agent}] ` : ''}${name} — ${email}`;

    const html = `
      <div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5">
        <h2 style="margin:0 0 8px">Nouveau message depuis le site</h2>
        <p><b>Nom</b> : ${escapeHtml(name)}<br/>
           <b>Email</b> : ${escapeHtml(email)}<br/>
           <b>Entreprise</b> : ${escapeHtml(company)}<br/>
           <b>Agent</b> : ${escapeHtml(agent)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>`;

    const send = await fetch('https://api.resend.com/emails', {
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
      }),
    });

    if (!send.ok) {
      const errText = await send.text();
      return new NextResponse(`Échec envoi: ${errText}`, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}

// petite protection XSS pour l'email HTML
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c] as string));
}
