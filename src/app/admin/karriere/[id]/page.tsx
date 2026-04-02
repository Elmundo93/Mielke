import { notFound } from "next/navigation";
import { getJobs } from "@/lib/content";
import JobEditForm from "./JobEditForm";

export default async function JobEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jobs = await getJobs();
  const job = jobs.find((j) => j.id === id);
  if (!job) notFound();

  return <JobEditForm job={job} />;
}
