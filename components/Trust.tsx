'use client';
import Card from "./Card";

export default function Trust() {
  return (
    <section id="trust" className="py-20 bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">IA responsable, simple et sûre.</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-xl font-semibold mb-1">Transparence</h3>
            <p className="text-muted">
              Tout ce que fait l’agent est enregistré.<br />
              Vous voyez qui a fait quoi, et quand.<br />
              Vous gardez la main à tout moment.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-1">Sécurité</h3>
            <p className="text-muted">
              Données protégées.<br />
              Accès très limité à l’équipe autorisée.<br />
              Sauvegardes régulières et contrôles.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-1">Vos données vous appartiennent</h3>
            <p className="text-muted">
              Jamais revendues ni partagées sans votre accord.<br />
              Pas utilisées pour améliorer l’IA sans votre permission.<br />
              Effaçables sur simple demande.
            </p>
          </Card>
        </div>

        <a href="/legal/ai-charter" className="inline-block mt-6 text-[color:var(--gold-1)]">
          Lire notre charte de confiance →
        </a>
      </div>
    </section>
  );
}
