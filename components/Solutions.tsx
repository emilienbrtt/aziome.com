'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import { Headphones, Repeat, BarChart2 } from 'lucide-react';

type Key = 'crm' | 'sav' | 'reporting' | null;

export default function Solutions() {
  const [selected, setSelected] = useState<Key>(null);

  useEffect(() => {
    if (selected) document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selected]);

  // ⚠️ Ordre voulu : CRM → SAV → Reporting
  const miniCards = [
    { key: 'crm' as const,       title: 'CRM & Relances', bullets: ['Plus de ventes', 'Clients qui reviennent'], Icon: Repeat },
    { key: 'sav' as const,       title: 'SAV',            bullets: ['Réponses rapides', 'Suivi des commandes'], Icon: Headphones },
    { key: 'reporting' as const, title: 'Reporting & KPI', bullets: ['Vos chiffres en clair', 'Alertes automatiques'], Icon: BarChart2 },
  ];

  const cardsToShow = selected ? miniCards.filter(c => c.key !== selected) : miniCards;

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-10">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {selected === 'crm'       && <div className="mb-8"><DetailCRM onClose={() => setSelected(null)} /></div>}
      {selected === 'sav'       && <div className="mb-8"><DetailSAV onClose={() => setSelected(null)} /></div>}
      {selected === 'reporting' && <div className="mb-8"><DetailReporting onClose={() => setSelected(null)} /></div>}

      <div className={`grid gap-6 ${selected ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {cardsToShow.map(({ key, title, bullets, Icon }) => (
          <Card key={key}>
            <div className="flex items-start gap-3">
              <Icon className="text-[color:var(--gold-1)]" />
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
        ))}
      </div>
    </section>
  );
}

/* =================== DÉTAILS — COPIE QUI CONVERTIT =================== */

function DetailCRM({ onClose }: { onClose: () => void }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Repeat className="text-[color:var(--gold-1)]" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold">CRM & Relances</h3>
            <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
          </div>

          {/* one-liner qui vend */}
          <p className="mt-3 text-muted">
            <strong>Ce que l’agent fait :</strong> récupère les paniers abandonnés, envoie un message après l’achat, fait revenir les anciens clients, s’arrête dès que le client répond.
          </p>

          <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium">Pourquoi c’est utile</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Vous récupérez des ventes perdues.</li>
                <li>Plus de clients reviennent acheter.</li>
                <li>Messages simples, au bon moment.</li>
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
                <li>Ouvertures et clics.</li>
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
            <h3 className="text-2xl font-semibold">SAV</h3>
            <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
          </div>

          <p className="mt-3 text-muted">
            <strong>Ce que l’agent fait :</strong> répond vite aux questions, suit les commandes, propose une réponse claire, passe à un humain si c’est particulier.
          </p>

          <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium">Pourquoi c’est utile</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Moins d’attente pour vos clients.</li>
                <li>Moins de charges pour l’équipe.</li>
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
                <li>Temps de réponse.</li>
                <li>Demandes résolues par l’agent.</li>
                <li>Satisfaction clients.</li>
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
            <h3 className="text-2xl font-semibold">Reporting & KPI</h3>
            <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100 underline">Fermer</button>
          </div>

          <p className="mt-3 text-muted">
            <strong>Ce que l’agent fait :</strong> met vos chiffres sur une page simple, envoie une alerte s’il voit un problème, répond à « Combien avons-nous vendu hier ? ».
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
                <li>Alertes par email/Slack.</li>
                <li>Petit résumé hebdo.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
