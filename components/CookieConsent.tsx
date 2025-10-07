'use client';

import { useEffect, useState } from 'react';

type Consent = {
  necessary: true;          // toujours vrai
  analytics: boolean;
  marketing: boolean;
  timestamp: string;        // ISO
  version: string;          // change la version si tu modifies la politique
};

const STORAGE_KEY = 'cookie-consent-v1';
const CONSENT_VERSION = '1.0.0';

function loadScript(src: string, attrs: Record<string,string> = {}) {
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  Object.entries(attrs).forEach(([k,v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

// Exemple: charger Google Analytics uniquement si "analytics" = true
function enableAnalytics() {
  // Remplace par ton ID GA4 si tu l’utilises
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  if (!GA_ID) return;
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(){ (window as any).dataLayer.push(arguments); }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

// Exemple: marketing (Meta Pixel / autres). Laisse vide si tu n’en as pas.
function enableMarketing() {
  // add your marketing pixels only if needed
}

function applyConsent(consent: Consent) {
  if (consent.analytics) enableAnalytics();
  if (consent.marketing) enableMarketing();
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);         // bannière visible ?
  const [panel, setPanel] = useState(false);       // panneau préférences
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Afficher la bannière si pas de consentement stocké
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setOpen(true);
        return;
      }
      const saved: Consent = JSON.parse(raw);
      // si on change la version, on redemande
      if (!saved || saved.version !== CONSENT_VERSION) {
        setOpen(true);
        return;
      }
      // appliquer silencieusement les choix
      applyConsent(saved);
    } catch {
      setOpen(true);
    }
  }, []);

  // Boutons
  const acceptAll = () => {
    const consent: Consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    applyConsent(consent);
    setOpen(false);
    setPanel(false);
  };

  const rejectAll = () => {
    const consent: Consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setOpen(false);
    setPanel(false);
  };

  const saveChoices = () => {
    const consent: Consent = {
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    applyConsent(consent);
    setOpen(false);
    setPanel(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center
                 bg-black/40 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      {/* Bannière compacte (si panel fermé) */}
      {!panel && (
        <div
          className="mx-4 sm:mx-0 w-[min(680px,92vw)] rounded-2xl
                     border border-white/12 bg-[#0b0b0b] text-white
                     shadow-[0_0_80px_rgba(212,175,55,0.12)]
                     p-5 sm:p-6"
        >
          <h3 className="text-lg font-semibold">Gestion des cookies</h3>
          <p className="text-sm text-white/70 mt-2">
            Nous utilisons des cookies pour assurer le bon fonctionnement du site (nécessaires),
            mesurer l’audience (analytics) et améliorer nos campagnes (marketing).
            Vous pouvez accepter, refuser ou personnaliser vos choix.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={acceptAll}
              className="px-4 py-2 rounded-xl bg-[color:var(--gold-1)]
                         text-black font-medium"
            >
              Tout accepter
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 rounded-xl border border-white/12
                         hover:border-[rgba(212,175,55,0.4)]"
            >
              Tout refuser
            </button>
            <button
              onClick={() => setPanel(true)}
              className="px-4 py-2 rounded-xl text-[color:var(--gold-1)]"
            >
              Personnaliser
            </button>
          </div>

          <p className="mt-3 text-xs text-white/50">
            Les cookies « nécessaires » sont toujours activés. Vous pouvez modifier vos
            préférences à tout moment depuis le pied de page.
          </p>
        </div>
      )}

      {/* Panneau de préférences détaillé */}
      {panel && (
        <div
          className="mx-4 sm:mx-0 w-[min(720px,94vw)] rounded-2xl
                     border border-white/12 bg-[#0b0b0b] text-white
                     shadow-[0_0_80px_rgba(212,175,55,0.12)]
                     p-5 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Préférences de confidentialité</h3>
            <button
              onClick={() => setPanel(false)}
              className="text-sm underline text-white/70 hover:text-white"
            >
              Retour
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <section className="rounded-xl border border-white/10 p-4">
              <h4 className="font-medium">Nécessaires <span className="text-xs text-white/50">(toujours actifs)</span></h4>
              <p className="text-sm text-white/60 mt-1">
                Indispensables au fonctionnement du site (sécurité, préférence de langue, consentement lui-même).
                Ils ne collectent pas de données personnelles à des fins marketing.
              </p>
            </section>

            <section className="rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Mesure d’audience (Analytics)</h4>
                <label className="inline-flex items-center gap-2 text-sm">
                  <span className="text-white/60">Off</span>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    aria-label="Activer analytics"
                  />
                  <span className="h-6 w-10 rounded-full bg-white/15 relative
                                   after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                   after:h-5 after:w-5 after:rounded-full after:bg-white
                                   peer-checked:after:translate-x-4 after:transition
                                   peer-checked:bg-[rgba(212,175,55,0.35)]" />
                  <span className="text-white/60">On</span>
                </label>
              </div>
              <p className="text-sm text-white/60 mt-1">
                Nous aide à comprendre l’usage du site pour l’améliorer (ex. Google Analytics avec anonymisation IP).
              </p>
            </section>

            <section className="rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Marketing</h4>
                <label className="inline-flex items-center gap-2 text-sm">
                  <span className="text-white/60">Off</span>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    aria-label="Activer marketing"
                  />
                  <span className="h-6 w-10 rounded-full bg-white/15 relative
                                   after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                   after:h-5 after:w-5 after:rounded-full after:bg-white
                                   peer-checked:after:translate-x-4 after:transition
                                   peer-checked:bg-[rgba(212,175,55,0.35)]" />
                  <span className="text-white/60">On</span>
                </label>
              </div>
              <p className="text-sm text-white/60 mt-1">
                Sert à personnaliser nos publicités et mesurer leur efficacité (pixels publicitaires).
              </p>
            </section>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={saveChoices}
              className="px-4 py-2 rounded-xl bg-[color:var(--gold-1)]
                         text-black font-medium"
            >
              Enregistrer mes choix
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 rounded-xl border border-white/12
                         hover:border-[rgba(212,175,55,0.4)]"
            >
              Tout refuser
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 rounded-xl text-[color:var(--gold-1)]"
            >
              Tout accepter
            </button>
          </div>

          <p className="mt-3 text-xs text-white/50">
            Enregistrer vos choix active immédiatement les catégories sélectionnées. Vous pourrez
            les modifier plus tard depuis le pied de page.
          </p>
        </div>
      )}
    </div>
  );
}
