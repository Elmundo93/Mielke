"use client";

import { useState, useEffect } from "react";

export type ConsentLevel = "all" | "necessary" | null;

export function useConsent(): { level: ConsentLevel; requestConsent: () => void } {
  const [level, setLevel] = useState<ConsentLevel>(null);

  useEffect(() => {
    setLevel((localStorage.getItem("consent") as ConsentLevel) ?? null);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "consent") setLevel((e.newValue as ConsentLevel) ?? null);
    };
    const onChanged = (e: Event) => setLevel((e as CustomEvent<ConsentLevel>).detail);

    window.addEventListener("storage", onStorage);
    window.addEventListener("consentChanged", onChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("consentChanged", onChanged);
    };
  }, []);

  const requestConsent = () => window.dispatchEvent(new CustomEvent("requestConsent"));

  return { level, requestConsent };
}
