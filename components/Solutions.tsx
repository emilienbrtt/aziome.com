'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import { Headphones, Repeat, BarChart2, MessageCircle, Users } from 'lucide-react';

type Key = 'crm' | 'sav' | 'reporting' | 'accueil' | 'rh' | null;

export default function Solutions() {
  const [selected, setSelected] = useState<Key>(null);

  useEffect(() => {
    if (selected) {
      document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selected]);

  // Données agents (texte inchangé)
  const allCards = [
    { key: 'crm' as const,       title: 'Max',   bullets: ['Assure le suivi de vos clients et leur envoie des rappels personnalisés pour ne rien oublier.'], Icon: Repeat,         layoutDefault: 'lg:col-span-4 lg:col-start-1' },
    { key: 'sav' as const,       title: 'Léa',   bullets: ['Automatise votre service après-vente (SAV)'],                                                  Icon: Headphones,     layoutDefault: 'lg:col-span-4 lg:col-start-5' },
    { key: 'reporting' as const, title: 'Jules', bullets: ['Regroupe vos chiffres clés et vous alerte si besoin.'],                                        Icon: BarChart2,      layoutDefault: 'lg:col-span-4 lg:col-start-9' },
    { key: 'accueil' as const,   title: 'Mia',   bullets: ['Premier contact de votre entreprise, elle accueille chaque demande et oriente vers la bonne personne.'], Icon: MessageCircle, layoutDefault: 'lg:col-span-4 lg:col-start-3' },
    { key: 'rh' as const,        title: 'Chris', bullets: ['Prend en charge les démarches RH et le support interne, sans paperasse.'],                     Icon: Users,          layoutDefault: 'lg:col-span-4 lg:col-start-7' },
  ];

  // Quand un détail est ouvert -> afficher les 4 restantes en 2×2 centrées
  const layoutWhenOpen = [
    'lg:col-span-4 lg:col-start-3',
    'lg:col-span-4 lg:col-start-7',
    'lg:col-span-4 lg:col-start-3',
    'lg:col-span-4 lg:col-start-7',
  ];

  const visibleCards = selected
    ? allCards.filter(c => c.key !== selected).map((c, i) => ({ ...c, layout: layoutWhenOpen[i] }))
    : allCards.map(c => ({ ...c, layout: c.layoutDefault }));

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-10">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {selected === 'crm'       && <div className="mb-8"><DetailCRM onClose={() => setSelected(null)} /></div>}
      {selected === 'sav'       && <div className="mb-8"><DetailSAV onClose={() => setSelected(null)} /></div>}
      {selected === 'reporting' && <div className="mb-8"><DetailReporting onClose={() => setSelected(null)} /></div>}
      {selected === 'accueil'   && <div className="mb-8"><DetailAccueil onClose={() => setSelected(null)} /></div>}
      {selected === 'rh'        && <div className="mb-8"><DetailRH onClose={() => setSelected(null)} /></div>}

      {/* GRID — mobile: 1 / tablette: 2 / desktop: 12 colonnes */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
        {visibleCards.map(({ key, title, bullets, Icon, layout }) => (
          <div
            key={key}
            className={`${layout} relative rounded-2xl transition-[transform,box-shadow,outline-color] duration-300
                        hover:-translate-y-0.5
                        hover:shadow-[0_0_90px_rgba(212,175,55,0.35)]
                        hover:outline hover:outline-2 hover:outline-[rgba(212,175,55,0.28)]`}
          >
            <Card>
              <div className="flex items-start gap-3 h-full min-h-[120px] md:min-h-[130px]">
                <Icon className="w-5 h-5 text-[color:var(--gold-1)] drop-shadow shrink-0 mt-0.5" />
                <div className="flex-1 flex flex-col pb-0.5">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <ul className="mt-1.5 text-sm text-muted list-disc pl-4 space-y-0.5">
                    {bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <button
                    onClick={() => setSelected(key)}
                    aria-expanded={selected === key}
                    className="text-sm mt-2 inline-block text-[color:var(--gold-1)]"
                  >
                    Voir le détail →
                  </button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =================== DÉTAILS (texte inchangé) =================== */

function DetailCRM({ onClose }: { onClose: () => void }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Repeat className="text-[color:var(--gold-1)]" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold">
              Max <span className="text-sm font-normal text-muted">· CRM & Relances</span>
            </h3>
            <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
          </div>
          <p className="mt-3 text-muted">
            <strong>Ce que l’agent fait :</strong> récupère les paniers abandonnés, envoie un message après l’achat,
            relance au bon moment et s’arrête dès que le client répond.
          </p>
          <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium">Pourquoi c’est utile</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Vous récupérez des ventes perdues.</li>
                <li>Plus de clients reviennent acheter.</li>
                <li>Messages clairs, au bon moment.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Ça marche avec</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Email, SMS, WhatsApp.</li>
                <li>Shopify, Stripe.</li>
                <li>Klaviyo, Mailchimp, HubSpot…</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Ce que vous voyez</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Ventes récupérées.</li>
                <li>Taux d’ouverture et de réponse.</li>
                <li>Clients réactivés.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DetailSAV({ onClose }: { onClose: () => void }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Headphones className="text-[color:var(--gold-1)]" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold">
              Léa <span className="text-sm font-normal text-muted">· Service après-vente (SAV)</span>
            </h3>
            <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
          </div>
          <p className="mt-3 text-muted">
            <strong>Ce que l’agent fait :</strong> répond vite et clairement, suit les commandes
            et transfère à un humain si besoin.
          </p>
          <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium">Pourquoi c’est utile</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Moins d’attente pour vos clients.</li>
                <li>Moins de charge pour l’équipe.</li>
                <li>Vous gardez la main à tout moment.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Ça marche avec</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Email, chat, WhatsApp.</li>
                <li>Gorgias, Zendesk, Freshdesk.</li>
                <li>Shopify, WooCommerce.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Ce que vous voyez</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Temps de réponse moyen.</li>
                <li>Demandes résolues par l’agent.</li>
                <li>Satisfaction client.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DetailReporting({ onClose }: { onClose: () => void }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <BarChart2 className="text-[color:var(--gold-1)]" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold">
              Jules <span className="text-sm font-normal text-muted">· Reporting & Résultats</span>
            </h3>
            <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
          </div>
          <p className="mt-3 text-muted">
            <strong>Ce que l’agent fait :</strong> met vos chiffres sur une page simple,
            envoie une alerte s’il détecte un problème et répond à « Combien avons-nous vendu hier ? ».
          </p>
          <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium">Pourquoi c’est utile</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Vous savez où vous en êtes chaque jour.</li>
                <li>Vous repérez les soucis tout de suite.</li>
                <li>Moins de fichiers, plus de clarté.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Ça marche avec</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Shopify / WooCommerce.</li>
                <li>Gorgias / Zendesk.</li>
                <li>Google Sheets, Looker, Notion.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Ce que vous voyez</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Tableau à jour.</li>
                <li>Alertes par email ou Slack.</li>
                <li>Résumé hebdomadaire.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DetailAccueil({ onClose }: { onClose: () => void }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <MessageCircle className="text-[color:var(--gold-1)]" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold">
              Mia <span className="text-sm font-normal text-muted">· Premier contact & orientation</span>
            </h3>
            <button onClick={onClose} classNa
