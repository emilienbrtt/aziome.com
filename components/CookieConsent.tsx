'use client';

import { useEffect, useState } from 'react';

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
};

const STORAGE_KEY = 'cookie-consent-v1';
const CONSENT_VERSION = '1.0.0';

/** Charge un script seulement côté client */
function loadScript(src: string, attrs: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

/** Exemple: Google Analytics (facultatif). Ne s’exécute que si autorisé. */
function enableAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  if (!GA_ID) return; // pas d’ID → on ignore

  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag() { (window as any).dataLayer.push(arguments); }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

/** Exemple marketing (Meta, etc.) — laisse vide si tu n’en as pas */
function enableMarketing() {
  // loadScript('https://…pixel.js')
}

function applyConsent(consent: Consent) {
  if (typeof window === 'undefined') return;
  if (consent.analytics) enableAnalytics();
  if (consent.marketing) enableMarketing();
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);    // bannière visible ?
  const [panel, setPanel] = useState(false);  // panneau détaillé ?
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Au montage: lire le consentement
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (!raw) { setOpen(true); return; }
      const saved: Consent | null = JSON.parse(raw);
      if (!saved || saved.version !== CONSENT_VERSION) { setOpen(true); return; }
      applyConsent(saved);
    } catch {
      setOpen(true);
    }
  }, []);

  const save = (c: Omit<Consent, 'timestamp' | 'version'>) => {
    const consent: Consent = {
      ...c,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    applyConsent(consent);
    setOpen(false);
    setPanel(false);
  };

  const acceptAll = () => save({ necessary: true, analytics: true, marketing: true });
  const rejectAll = () => save({ necessary: true, analytics: false, marketing: false });
  const saveChoices = () => save({ necessary: true, analytics, marketing });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center
                 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      {/* Vue compacte */}
      {!panel && (
        <div
          className="mx-4 sm:mx-0 w-[min(680px,92vw)] rounded-2xl
                     border border-white/12 bg-[#0b0b0b] text-white
                     shadow-[0_0_80px_rgba(212,175,55,0.12)]
                     p-5 sm:p-6"
        >
          <h3 className="text-lg font-semibold">Gestion des cookies</h3>
          <p className="text-sm text-white/70 mt-2">
            Nous utilisons des cookies nécessaires au fonctionnement du site,
            ainsi que des cookies pour la mesure d’audience et le marketing.
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
            Les cookies « nécessaires » sont toujours actifs. Vous pourrez
            modifier vos choix plus tard depuis le pied de page.
          </p>
        </div>
      )}

      {/* Panneau détaillé */}
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
              <h4 className="font-medium">
                Nécessaires <span className="text-xs text-white/50">(toujours actifs)</span>
              </h4>
              <p className="text-sm text-white/60 mt-1">
                Sécurité, accès, sauvegarde de vos préférences… aucune publicité.
              </p>
            </section>

            {/* Switch sans pseudo-élément tricky */}
            <section className="rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Mesure d’audience (Analytics)</h4>
                <label className="inline-flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-5 w-5 accent-[color:var(--gold-1)]"
                    aria-label="Activer analytics"
                  />
                  <span className="text-sm text-white/70">{analytics ? 'Activé' : 'Désactivé'}</span>
                </label>
              </div>
              <p className="text-sm text-white/60 mt-1">
                Ex. Google Analytics (IP anonymisée). Aide à améliorer le site.
              </p>
            </section>

            <section className="rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Marketing</h4>
                <label className="inline-flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-5 w-5 accent-[color:var(--gold-1)]"
                    aria-label="Activer marketing"
                  />
                  <span className="text-sm text-white/70">{marketing ? 'Activé' : 'Désactivé'}</span>
                </label>
              </div>
              <p className="text-sm text-white/60 mt-1">
                Pixels publicitaires pour personnaliser et mesurer nos campagnes.
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
            Les choix sont appliqués immédiatement. Vous pouvez les changer
            plus tard depuis le pied de page.
          </p>
        </div>
      )}
    </div>
  );
}
