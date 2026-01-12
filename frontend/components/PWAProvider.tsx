"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import PWAStatusBar from "./PWAStatusBar";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type PWAContextValue = {
  isOffline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  promptInstall: () => Promise<void>;
};

const PWAContext = createContext<PWAContextValue | null>(null);

export function usePWAStatus() {
  const ctx = useContext(PWAContext);
  if (!ctx) {
    throw new Error("usePWAStatus must be used within a PWAProvider");
  }
  return ctx;
}

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(
    () => (typeof navigator === "undefined" ? false : !navigator.onLine)
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  // Register service worker once on mount
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("SW registration failed", err);
    });
  }, []);

  // Track online/offline state and SW offline fallbacks
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "OFFLINE_FALLBACK") {
        setIsOffline(true);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    navigator.serviceWorker?.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, []);

  // Detect display mode (installed vs. browser)
  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const computeInstalled = () =>
      media.matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    const update = () => setIsInstalled(computeInstalled());
    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Capture install prompt without auto-prompting
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  // Listen for API failure notifications dispatched from fetch helpers
  useEffect(() => {
    const handleApiOffline = () => setIsOffline(true);
    const handleApiOnline = () => setIsOffline(false);

    window.addEventListener("lifegrid:api-offline", handleApiOffline);
    window.addEventListener("lifegrid:api-online", handleApiOnline);
    return () => {
      window.removeEventListener("lifegrid:api-offline", handleApiOffline);
      window.removeEventListener("lifegrid:api-online", handleApiOnline);
    };
  }, []);

  const promptInstall = async () => {
    const evt = installEvent;
    if (!evt?.prompt) return;
    await evt.prompt();
    setInstallEvent(null);
  };

  const value = useMemo(
    () => ({
      isOffline,
      isInstalled,
      canInstall: Boolean(installEvent) && !isInstalled,
      promptInstall,
    }),
    [installEvent, isInstalled, isOffline]
  );

  return (
    <PWAContext.Provider value={value}>
      <PWAStatusBar />
      {children}
    </PWAContext.Provider>
  );
}

