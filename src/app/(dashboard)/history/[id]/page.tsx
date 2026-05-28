import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/history" className="p-2 rounded-full hover:bg-gray-200 text-gray-500">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">Results: {job.niche}</h1>
          <p className="text-sm text-gray-500">
            Generated {job.products.length} products on {new Date(job.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {job.status === "processing" && (
        <div className="p-8 text-center bg-white rounded-lg border shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating your content... This might take a minute.</p>
        </div>
      )}

      {job.status === "failed_temp" && (
        <div className="p-8 text-center bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
          Generation paused due to temporary high demand on the AI service. Please try generating again later.
        </div>
      )}

      {job.status === "failed" && (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg border border-red-200">
          Generation failed due to an unexpected error. Please try again.
        </div>
      )}

      {job.status === "completed" && (
        <ResultsClient products={job.products} niche={job.niche} />
      )}
    </div>
  );
}
