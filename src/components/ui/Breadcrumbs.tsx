"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbListJsonLd } from "@/lib/schema";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [
    { name: "Startseite", url: "/" },
    ...items
  ];

  return (
    <>
      <BreadcrumbListJsonLd items={allItems} />
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
        <Link 
          href="/" 
          className="flex items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <Home className="w-4 h-4" />
        </Link>
        
        {allItems.slice(1).map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4" />
            {index === allItems.length - 2 ? (
              <span className="text-gray-900 dark:text-white font-medium">
                {item.name}
              </span>
            ) : (
              <Link 
                href={item.url}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}

