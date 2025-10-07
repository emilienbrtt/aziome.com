import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, agent, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ ok: false, error: 'MISSING_FIELDS' }, { status: 400 });
    }

    const to = process.env.CONTACT_TO;
    const from = process.env.CONTACT_FROM || 'Aziome <no-reply@example.com>';

    if (!to) {
      return NextResponse.json({ ok: false, error: 'CONTACT_TO_NOT_SET' }, { status: 500 });
    }

    await resend.emails.send({
      from,
      to,
      reply_to: email,
      subject: `Contact — ${agent ? `Agent ${agent}` : 'Aziome'}`,
      text:
`De : ${name || 'Anonyme'} <${email}>
Agent : ${agent || '—'}

${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: 'SEND_FAILED' }, { status: 500 });
  }
}
