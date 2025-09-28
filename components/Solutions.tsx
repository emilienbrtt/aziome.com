'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import { Headphones, Repeat, BarChart2, MessageCircle, Users } from 'lucide-react';

type Key = 'crm' | 'sav' | 'reporting' | 'accueil' | 'rh' | null;

export default function Solutions() {
  const [selected, setSelected] = useState<Key>(null);

  useEffect(() => {
    if (selected) document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selected]);

  // Mise en page 3 + 2 (desktop) avec positions contrôlées
  // -> Row 1: Max | Léa | Jules
  // -> Row 2:      Mia | Chris (centrées)
  const miniCards = [
    {
      key: 'crm' as const,
      title: 'Max',
      bullets: ['Assure le suivi de vos clients et leur envoie des rappels personnalisés pour ne rien oublier.'],
      Icon: Repeat,
      layout: 'lg:col-span-4',                 // row1 col1
    },
    {
      key: 'sav' as const,
      title: 'Léa',
      bullets: ['Automatise votre service après-vente (SAV)'],
      Icon: Headphones,
      layout: 'lg:col-span-4',                 // row1 col2
    },
    {
      key: 'reporting' as const,
      title: 'Jules',
      bullets: ['Regroupe vos chiffres clés et vous alerte si besoin.'],
      Icon: BarChart2,
      layout: 'lg:col-span-4',                 // row1 col3
    },
    {
      key: 'accueil' as const,
      title: 'Mia',
      bullets: ['Premier contact de votre entreprise, elle accueille chaque demande et oriente vers la bonne personne.'],
      Icon: MessageCircle,
      layout: 'lg:col-span-4 lg:col-start-3', // row2 col2 (centrée)
    },
    {
      key: 'rh' as const,
      title: 'Chris',
      bullets: ['Prend en charge les démarches RH et le support interne, sans paperasse.'],
      Icon: Users,
      layout: 'lg:col-span-4 lg:col-start-7', // row2 col3 (centrée)
    },
  ];

  const cardsToShow = selected ? miniCards.filter(c => c.key !== selected) : miniCards;

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-10">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {selected === 'crm'       && <div className="mb-8"><DetailCRM onClose={() => setSelected(null)} /></div>}
      {selected === 'sav'       && <div className="mb-8"><DetailSAV onClose={() => setSelected(null)} /></div>}
      {selected === 'reporting' && <div className="mb-8"><DetailReporting onClose={() => setSelected(null)} /></div>}
      {selected === 'accueil'   && <div className="mb-8"><DetailAccueil onClose={() => setSelected(null)} /></div>}
      {selected === 'rh'        && <div className="mb-8"><DetailRH onClose={() => setSelected(null)} /></div>}

      {/* GRID — mobile: 1 / tablet: 2 / desktop: 12 (3+2 centrées) */}
      <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-12`}>
        {cardsToShow.map(({ key, title, bullets, Icon, layout }) => (
          <div
            key={key}
            className={`${layout} group transition-[transform,box-shadow] duration-300
                        hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]`}
          >
            <Card>
              <div className="flex items-start gap-3">
                <Icon className="text-[color:var(--gold-1)] drop-shadow" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <ul className="mt-2 text-sm text-muted list-disc pl-4 space-y-1">
                    {bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <button
                    onClick={() => setSelected(key)}
                    aria-expanded={selected === key}
                    className="text-sm mt-3 inline-block text-[color:var(--gold-1)]"
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

/* =================== DÉTAILS =================== */

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
            <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
          </div>

          <p className="mt-3 text-muted">
            <strong>Ce que l’agent fait :</strong> accueille chaque demande, pose les bonnes questions
            et oriente vers la bonne personne ou le bon service.
          </p>

          <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium">Pourquoi c’est utile</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Réponses immédiates, 24h/24.</li>
                <li>Moins d’appels/emails perdus.</li>
                <li>Parcours client plus fluide.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Ça marche avec</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Chat du site, formulaire, email.</li>
                <li>WhatsApp, Facebook/Instagram.</li>
                <li>Transcriptions d’appels, Slack.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Ce que vous voyez</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Demandes prises en charge.</li>
                <li>Catégories & motifs récurrents.</li>
                <li>Taux de transfert vers humain.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DetailRH({ onClose }: { onClose: () => void }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Users className="text-[color:var(--gold-1)]" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold">
              Chris <span className="text-sm font-normal text-muted">· Démarches RH & support interne</span>
            </h3>
            <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
          </div>

          <p className="mt-3 text-muted">
            <strong>Ce que l’agent fait :</strong> gère les demandes internes (attestations, absences, congés),
            prépare les documents et répond aux questions courantes des équipes.
          </p>

          <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium">Pourquoi c’est utile</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Moins d’administratif pour les RH.</li>
                <li>Réponses rapides pour les équipes.</li>
                <li>Moins d’erreurs et de retards.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Ça marche avec</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Google Workspace/Drive, Notion.</li>
                <li>Slack ou Microsoft Teams.</li>
                <li>Outils SIRH (placeholders).</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Ce que vous voyez</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Demandes traitées.</li>
                <li>Documents générés.</li>
                <li>Délai moyen de réponse.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
