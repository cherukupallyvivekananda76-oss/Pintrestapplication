import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { ResultsClient } from "./ResultsClient";

export default async function JobResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const resolvedParams = await params;

  if (!resolvedParams?.id) {
    notFound();
  }

  const job = await prisma.generationJob.findFirst({
    where: {
      id: resolvedParams.id,
      userId: session.user.id
    },
    include: {
      products: true
    }
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-start gap-4">
        <Link href="/history" className="app-icon-button mt-1 shrink-0" aria-label="Back to history">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="app-page-header">
          <p className="app-eyebrow">Results</p>
          <h1 className="app-title capitalize">Results: {job.niche}</h1>
          <p className="app-subtitle">
            Generated {job.products.length} products on {new Date(job.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {job.status === "processing" && (
        <div className="app-card px-6 py-12 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--accent)]" />
          <p className="mt-4 text-sm font-semibold text-[var(--muted)]">Generating your content... This might take a minute.</p>
        </div>
      )}

      {job.status === "failed_temp" && (
        <div className="app-alert app-alert-warning">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">
            Generation paused due to temporary high demand on the AI service. Please try generating again later.
          </p>
        </div>
      )}

      {job.status === "failed" && (
        <div className="app-alert app-alert-danger">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">Generation failed due to an unexpected error. Please try again.</p>
        </div>
      )}

      {job.status === "completed" && (
        <ResultsClient products={job.products} niche={job.niche} />
      )}
    </div>
  );
}
