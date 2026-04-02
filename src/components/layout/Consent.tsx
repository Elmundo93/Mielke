"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Consent() {
  const [visible, setVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const v = localStorage.getItem("consent");
    if (!v) setVisible(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient || !visible) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95">
      <div className="mx-auto max-w-6xl px-4 py-4 text-sm">
        <p>
          Wir verwenden technisch notwendige Cookies. Externe Inhalte (z. B. Karten) werden erst nach Ihrer Zustimmung geladen.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={() => { localStorage.setItem("consent","all"); setVisible(false); }}>
            Einverstanden
          </Button>
          <Button variant="secondary" size="sm" onClick={() => { localStorage.setItem("consent","necessary"); setVisible(false); }}>
            Nur notwendig
          </Button>
        </div>
      </div>
    </div>
  );
}

