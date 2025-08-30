'use client';
import Card from "./Card";

export default function Trust() {
  return (
    <section id="trust" className="py-20 bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">IA responsable par design.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card><h3 className="text-xl font-semibold mb-1">RGPD & AI Act</h3><p className="text-muted">Transparence, journalisation, anonymisation, HITL.</p></Card>
          <Card><h3 className="text-xl font-semibold mb-1">Sécurité</h3><p className="text-muted">Clés chiffrées, accès restreint, rétention limitée.</p></Card>
          <Card><h3 className="text-xl font-semibold mb-1">Données</h3><p className="text-muted">Pas de fine‑tuning sans accord explicite.</p></Card>
        </div>
        <a href="/legal/ai-charter" className="inline-block mt-6 text-[color:var(--gold-1)]">Lire la charte IA responsable →</a>
      </div>
    </section>
  );
}
