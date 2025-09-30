export const metadata = {
  title: "Charte IA responsable — Aziome",
  description:
    "Transparence, Human-in-the-Loop, pas d’usage secondaire sans accord, logs 30–90 jours, réversibilité.",
};

export default function Page() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24 space-y-6">
      <h1 className="text-4xl font-semibold gold-text">Charte IA responsable</h1>
      <ul className="list-disc pl-6 space-y-2 text-muted">
        <li>Transparence : les interactions IA sont identifiées clairement.</li>
        <li>HITL (Human-in-the-Loop) : un humain peut superviser, valider ou annuler les actions sensibles.</li>
        <li>Données : pas d’usage secondaire sans consentement explicite. Pas de fine-tuning sur vos données sans accord.</li>
        <li>Journalisation : logs 30–90 jours pour audit et amélioration.</li>
        <li>Réversibilité : export & suppression des données sur demande.</li>
      </ul>
    </section>
  );
}
