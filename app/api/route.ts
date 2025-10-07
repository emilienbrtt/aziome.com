import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { agent, name, company, email, message } = await req.json();
    if (!email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO = process.env.CONTACT_TO;     // ex: hello@aziome.com
    const CONTACT_FROM = process.env.CONTACT_FROM; // ex: Aziome <noreply@aziome.com>

    if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
      console.warn('Missing env vars for email send. Simulating success.');
      return NextResponse.json({ ok: true, simulated: true });
    }

    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      reply_to: email,
      subject: `Contact — ${agent || 'Agent'} — ${name || email}`,
      text: [
        `Agent : ${agent || '-'}`,
        `Nom : ${name || '-'}`,
        `Société : ${company || '-'}`,
        `Email : ${email}`,
        '',
        'Message :',
        message,
      ].join('\n'),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
