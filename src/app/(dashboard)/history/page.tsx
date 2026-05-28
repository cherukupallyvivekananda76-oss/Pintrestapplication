import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Clock, History, PlusCircle } from "lucide-react";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const jobs = await prisma.generationJob.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="app-page-header">
        <p className="app-eyebrow">Archive</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="app-title">Generation history</h1>
            <p className="app-subtitle mt-3">View past generations, inspect outputs, and export finished content.</p>
          </div>
          <Link href="/generate" className="app-button-primary w-full gap-2 sm:w-auto">
            <PlusCircle className="h-4 w-4" />
            New generation
          </Link>
        </div>
      </div>

      <div className="app-card overflow-hidden">
        {jobs.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <History className="mx-auto h-9 w-9 text-[var(--accent)]" />
            <h2 className="mt-4 text-lg font-extrabold text-[var(--foreground)]">No history yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              Your completed generations will appear here with status, product counts, and exportable results.
            </p>
            <Link href="/generate" className="app-button-primary mt-5 gap-2">
              <PlusCircle className="h-4 w-4" />
              Create pins
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link href={`/history/${job.id}`} className="block hover:bg-[var(--surface-muted)]">
                  <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[var(--surface-muted)] text-[var(--muted-strong)]">
                        <Clock className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-extrabold capitalize text-[var(--foreground)]">
                          {job.niche}
                        </p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {job._count.products} products • {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className={`app-badge ${
                        job.status === "completed" ? "bg-[var(--success-soft)] text-[var(--success)]" :
                        job.status === "failed" ? "bg-[var(--danger-soft)] text-[var(--danger)]" :
                        "bg-[var(--warning-soft)] text-[var(--warning)]"
                      }`}>
                        {job.status}
                      </span>
                      <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
