'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookie-consent-v1';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  // Afficher la bannière seulement si aucun choix n'est enregistré
  useEffect(() => {
    try {
      const val = localStorage.getItem(STORAGE_KEY);
      if (!val) setOpen(true);
    } catch {
      // ignore
    }
  }, []);

  // Pendant que la bannière est ouverte, on peut aussi forcer le masquage global
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add('cookies-open');
    else root.classList.remove('cookies-open');
    return () => root.classList.remove('cookies-open');
  }, [open]);

  const decide = (v: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(STORAGE_KEY, v);
      // informer les autres onglets/composants (si besoin)
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: v }));
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <>
      {/* 1) Tant que la bannière est ouverte, on camoufle aussi certains widgets tiers connus */}
      <style jsx global>{`
        .cookies-open #crisp-chatbox,
        .cookies-open .crisp-client,
        .cookies-open .intercom-lightweight-app,
        .cookies-open .intercom-launcher,
        .cookies-open iframe[src*="intercom"],
        .cookies-open #tidio-chat,
        .cookies-open .tawk-min-chat,
        .cookies-open [id^="hubspot-messages-iframe"] {
          opacity: 0 !important;
          pointer-events: none !important;
        }
        /* 2) Notre chat custom est aussi masqué via son wrapper dédié */
        .cookies-open #aziome-chat {
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>

      {/* 3) Bannière tout en haut de la pile (z-index > chat) + respect du safe-area mobile */}
      <div
        className="fixed inset-x-0 px-4 z-[2147483650]"
        style={{ bottom: 'max(12px, env(safe-area-inset-bottom))' }}
        role="dialog"
        aria-live="polite"
        aria-label="Consentement aux cookies"
      >
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/80 backdrop-blur p-4 md:p-5 shadow-2xl">
          <p className="text-sm text-white/90">
            Nous utilisons des cookies essentiels pour faire fonctionner le site.
            Les cookies d’analyse sont désactivés par défaut.
            <Link href="/legal/privacy" className="underline decoration-white/40 hover:decoration-white ml-1">
              En savoir plus
            </Link>.
          </p>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => decide('rejected')}
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Refuser
            </button>

            <button
              type="button"
              onClick={() => decide('accepted')}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-black
                         bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow hover:shadow-lg"
            >
              Tout accepter
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
