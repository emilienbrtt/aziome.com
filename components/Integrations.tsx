'use client';

const logos = [
  // Messagerie & e-mail
  'WhatsApp Business',
  'Gmail',
  'Outlook',
  'Facebook Messenger',
  'Instagram DM',
  // Boutique
  'Shopify',
  'WooCommerce',
  'PrestaShop',
  // Paiement
  'Stripe',
  'PayPal',
  // Marketing & Analytics
  'Google Analytics (GA4)',
  'Google Ads',
  'Meta Ads',
  // CRM / Productivité / Automatisation
  'HubSpot',
  'Notion',
  'Zapier',
];

export default function Integrations() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Aperçu des intégrations</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-80">
        {logos.map((l) => (
          <div
            key={l}
            className="
              text-center py-6 rounded-2xl
              border border-[rgba(255,255,255,0.10)] bg-black/20
              text-muted hover:text-[color:var(--gold-1)]
              hover:border-[rgba(212,175,55,0.45)]
              hover:shadow-[0_0_50px_rgba(212,175,55,0.18)]
              transition
            "
            title={l}
            aria-label={l}
          >
            {l}
          </div>
        ))}
      </div>
    </section>
  );
}
