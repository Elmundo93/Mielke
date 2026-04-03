"use client";

import Link from "next/link";
import { useState } from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const services = [
    { name: "Sanitätshaus", href: "/leistungen/sanitaetshaus" },
    { name: "Rehatechnik", href: "/leistungen/rehatechnik" },
    { name: "Orthopädietechnik", href: "/leistungen/orthopaedietechnik" },
    { name: "Orthopädieschuhtechnik", href: "/leistungen/orthopaedieschuhtechnik" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold"><Image src="/Mielke_Logo_b.webp" alt="Sanitätshaus" width={350} height={75} /></Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/standorte" className="text-lg px-3 py-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Standorte</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xl px-3 py-2 font-normal bg-transparent hover:bg-transparent">Leistungen</NavigationMenuTrigger>
              <NavigationMenuContent className="p-3">
                <div className="grid min-w-[320px] gap-2 sm:min-w-[420px] sm:grid-cols-2">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      className="text-lg px-3 py-2 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      href={service.href}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/ueber-uns" className="text-lg px-3 py-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Über uns</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/karriere" className="text-lg px-3 py-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Karriere</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/kontakt" className="text-lg px-3 py-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Kontakt</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

    

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span className="sr-only">Menü öffnen</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menü</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/standorte"
                className="text-lg font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Standorte
              </Link>
              
              <div className="flex flex-col gap-2">
                <span className="text-lg font-medium">Leistungen</span>
                <div className="flex flex-col gap-2 ml-4">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/ueber-uns"
                className="text-lg font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Über uns
              </Link>

              <Link
                href="/karriere"
                className="text-lg font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Karriere
              </Link>

              <Link
                href="/kontakt"
                className="text-lg font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Kontakt
              </Link>

              <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/kontakt" onClick={() => setIsOpen(false)}>
                  Termin anfragen
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

