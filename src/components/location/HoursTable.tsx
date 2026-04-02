import type { Location } from "@/lib/content";

export function HoursTable({ openingHours }: { openingHours: NonNullable<Location["openingHours"]> }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {openingHours.map((h) => {
          // Pause gilt nur wenn beide Felder nicht leer sind.
          // Keystatic schreibt leere Strings wenn keine Pause angegeben ist.
          const hasPause = !!(h.pause?.from?.trim() && h.pause?.to?.trim());
          return (
            <tr key={h.day} className="border-b last:border-0">
              <td className="py-2 font-medium w-32">{h.day}</td>
              <td className="py-2">
                {hasPause ? (
                  <span>
                    {h.opens}–{h.pause!.from}
                    <span className="mx-2 text-gray-400 dark:text-gray-500 text-xs">Pause</span>
                    {h.pause!.to}–{h.closes}
                  </span>
                ) : (
                  <span>{h.opens}–{h.closes}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
