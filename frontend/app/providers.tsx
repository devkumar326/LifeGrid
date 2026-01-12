"use client";

import PWAProvider from "../components/PWAProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <PWAProvider>{children}</PWAProvider>;
}

