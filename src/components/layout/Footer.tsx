import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Sanitätshaus MIELKE</div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Ihr Spezialist für Orthopädietechnik seit 1989. Individuelle Versorgung in fünf Standorten der Region.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <strong className="text-emerald-600 dark:text-emerald-400">35+</strong> Jahre Erfahrung
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <strong className="text-emerald-600 dark:text-emerald-400">5</strong> Standorte
            </div>
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-gray-900 dark:text-white mb-3">Navigation</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/standorte" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Standorte</Link></li>
            <li><Link href="/leistungen" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Leistungen</Link></li>
            <li><Link href="/ueber-uns" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Über uns</Link></li>
            <li><Link href="/kontakt" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Kontakt</Link></li>
          </ul>
        </div>
        
        <div>
          <div className="font-semibold text-gray-900 dark:text-white mb-3">Leistungen</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/leistungen/sanitaetshaus" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Sanitätshaus</Link></li>
            <li><Link href="/leistungen/rehatechnik" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Rehatechnik</Link></li>
            <li><Link href="/leistungen/orthopaedietechnik" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Orthopädietechnik</Link></li>
            <li><Link href="/leistungen/orthopaedieschuhtechnik" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Orthopädieschuhtechnik</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Sanitätshaus MIELKE – Alle Rechte vorbehalten.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/impressum" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

