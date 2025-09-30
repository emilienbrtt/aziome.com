export const metadata = {
  title: "Mentions légales — Aziome",
  description: "Coordonnées de contact et mentions légales minimales en attendant la création de la société.",
};

export default function Page() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24 space-y-6">
      <h1 className="text-4xl font-semibold gold-text">Mentions légales</h1>

      <p className="text-muted">
        Aziome — Liège, Belgique. Contact :{" "}
        <a className="underline" href="mailto:aziomeagency@gmail.com">aziomeagency@gmail.com</a>
      </p>

      <p className="text-muted">
        Raison sociale et n° d’entreprise : à compléter lors de la création de la société.
      </p>
    </section>
  );
}
