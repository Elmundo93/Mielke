"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleJob } from "@/lib/admin-actions";
import type { Job } from "@/lib/content";

export default function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <ul className="space-y-2">
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} />
      ))}
    </ul>
  );
}

function JobRow({ job }: { job: Job }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle() {
    startTransition(async () => {
      await toggleJob(job.id, !job.active);
      router.refresh();
    });
  }

  return (
    <li className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-5 py-4">
      {/* Toggle */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={job.active ? "Stelle deaktivieren" : "Stelle aktivieren"}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50 ${
          job.active ? "bg-emerald-500" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            job.active ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{job.title}</p>
        <p className="text-sm text-gray-500">{job.category} · {job.type}</p>
      </div>

      {/* Status-Badge */}
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
        job.active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-500"
      }`}>
        {job.active ? "Aktiv" : "Inaktiv"}
      </span>

      {/* Bearbeiten-Link */}
      <Link
        href={`/admin/karriere/${job.id}`}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Bearbeiten"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </Link>
    </li>
  );
}
