"use client";

import { useEffect, useState } from "react";

import { usePWAStatus } from "./PWAProvider";

export default function PWAStatusBar() {
  const { isOffline, canInstall, promptInstall, isInstalled } = usePWAStatus();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isOffline || canInstall);
  }, [isOffline, canInstall]);

  if (!visible) return null;

  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur border-b border-white/5 text-xs text-zinc-300">
      {isOffline && (
        <span className="px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-200 border border-yellow-500/40">
          Offline mode — recent data may be cached
        </span>
      )}

      {canInstall && !isInstalled && (
        <button
          onClick={promptInstall}
          className="px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-zinc-200 hover:border-[var(--accent)] transition-colors"
        >
          Install LifeGrid
        </button>
      )}

      {isInstalled && !isOffline && (
        <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-200 border border-emerald-500/30">
          Running as app
        </span>
      )}
    </div>
  );
}

