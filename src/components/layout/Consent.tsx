"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function setConsent(level: "all" | "necessary") {
  localStorage.setItem("consent", level);
  window.dispatchEvent(new CustomEvent("consentChanged", { detail: level }));
}

export function Consent() {
  const [visible, setVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!localStorage.getItem("consent")) setVisible(true);

    const onRequest = () => setVisible(true);
    window.addEventListener("requestConsent", onRequest);
    return () => window.removeEventListener("requestConsent", onRequest);
  }, []);

  if (!isClient || !visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-4 text-sm">
        <p>
          Wir verwenden technisch notwendige Cookies. Externe Inhalte (z.&nbsp;B. Karten) werden erst nach Ihrer Zustimmung geladen.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={() => { setConsent("all"); setVisible(false); }}>
            Einverstanden
          </Button>
          <Button variant="secondary" size="sm" onClick={() => { setConsent("necessary"); setVisible(false); }}>
            Nur notwendig
          </Button>
        </div>
      </div>
    </div>
  );
}
