'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookie-consent-v1';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  // Afficher la bannière seulement si aucun choix n'a été enregistré
  useEffect(() => {
    try {
      const val = localStorage.getItem(STORAGE_KEY);
      if (!val) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  // Pendant que la bannière est ouverte : masquer le launcher du chat (Crisp / Intercom)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;

    try {
      // ---- CRISP ----
      // Toujours définir $crisp pour pouvoir "queue" des commandes avant le chargement du script.
      w.$crisp = w.$crisp || [];
      if (open) {
        w.$crisp.push(['do', 'chat:hide']);
      } else {
        w.$crisp.push(['do', 'chat:show']);
      }

      // ---- INTERCOM ----
      // Si Intercom n'est pas encore prêt, on pose la conf globale (elle sera lue à l'init).
      w.intercomSettings = { ...(w.intercomSettings || {}), hide_default_launcher: !!open };
      if (typeof w.Intercom === 'function') {
        w.Intercom('update', { hide_default_launcher: !!open });
      }
    } catch {
      /* ignore */
    }

    // Sécurité : on ré-affiche le launcher si le composant est démonté
    return () => {
      try {
        w.$crisp = w.$crisp || [];
        w.$crisp.push(['do', 'chat:show']);
        if (typeof w.Intercom === 'function') w.Intercom('update', { hide_default_launcher: false });
      } catch {
        /* ignore */
      }
    };
  }, [open]);

  const decide = (v: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch { /* ignore */ }
    setOpen(false);
  };

  if (!open) return null;

  return (
    // Z-index au sommet de l'univers. + safe-area pour iPhone.
    <div
      className="fixed inset-x-0 px-4 z-[2147483647]"
      style={{ bottom: '12px', paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="dialog"
      aria-live="polite"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <div className="p-4 md:p-5">
          <p className="text-sm leading-relaxed text-white/90">
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
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
            >
              Refuser
            </button>

            <button
              type="button"
              onClick={() => decide('accepted')}
              className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-black
                         bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white shadow-md hover:shadow-lg transition"
            >
              Tout accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
