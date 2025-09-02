'use client';

export default function ContactForm() {
  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Demander une démo</h2>

      <form action="https://formsubmit.co/aziomeagency@gmail.com" method="POST" className="glass p-6 rounded-2xl grid gap-4">
        {/* Config FormSubmit */}
        <input type="hidden" name="_subject" value="Demande de démo — Aziome" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />

        <input name="name" placeholder="Nom" required className="bg-transparent border border-white/10 rounded-lg px-4 py-3" />
        <input name="email" type="email" placeholder="Email" required className="bg-transparent border border-white/10 rounded-lg px-4 py-3" />
        <input name="website" placeholder="Site / Outil principal (optionnel)" className="bg-transparent border border-white/10 rounded-lg px-4 py-3" />
        <textarea name="message" rows={5} placeholder="Votre message" required className="bg-transparent border border-white/10 rounded-lg px-4 py-3" />

        <button type="submit" className="btn btn-primary w-full">Envoyer ma demande</button>

        {/* lien de secours si jamais */}
        <p className="text-sm opacity-70">
          Ou écrivez-nous : <a href="mailto:aziomeagency@gmail.com" className="text-[color:var(--gold-1)]">aziomeagency@gmail.com</a>
        </p>
      </form>
    </section>
  );
}
