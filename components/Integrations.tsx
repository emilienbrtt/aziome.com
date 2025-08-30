'use client';
const logos = ["Shopify","WooCommerce","HubSpot","Notion","n8n","Stripe","GA4","Meta Ads"];

export default function Integrations() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Aperçu des intégrations</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-80">
        {logos.map(l => (
          <div key={l} className="text-center py-6 border border-[rgba(255,255,255,0.06)] rounded-2xl text-muted hover:text-[color:var(--gold-1)] transition">
            {l}
          </div>
        ))}
      </div>
    </section>
  );
}
