import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock } from "lucide-react";

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
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generation History</h1>
        <p className="mt-2 text-gray-600">View your past generations and export content.</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No history yet. Go to <Link href="/generate" className="text-blue-600 hover:underline">Generate</Link> to create some pins!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link href={`/history/${job.id}`} className="block hover:bg-gray-50">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {job.niche}
                        </p>
                        <p className="text-sm text-gray-500">
                          {job._count.products} products • {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === "completed" ? "bg-green-100 text-green-800" :
                        job.status === "failed" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {job.status}
                      </span>
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
