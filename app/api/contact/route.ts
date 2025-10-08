const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const CONTACT_TO = process.env.CONTACT_TO!;
const CONTACT_FROM = process.env.CONTACT_FROM || 'Aziome <noreply@aziome.com>';

// ...
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    reply_to: email,       // ← la personne qui remplit le formulaire
    subject: `[Contact] ${agent ? `[${agent}] ` : ''}${name} → ${email}`,
    html,                  // ton HTML du message
  }),
});
