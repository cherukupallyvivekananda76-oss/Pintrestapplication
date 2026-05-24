import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, Settings as SettingsIcon, History } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return null;

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id }
  });

  const recentJobs = await prisma.generationJob.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const needsSetup = !settings?.affiliateTag;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your activity.</p>
      </div>

      {needsSetup && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <SettingsIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You haven't set your Amazon Affiliate Tag yet.
                <Link href="/settings" className="font-medium underline ml-1 hover:text-yellow-600">
                  Go to Settings to set it up
                </Link>
                so your generated links will include your tag.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/generate" className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <PlusCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">New Generation</h3>
              <p className="text-sm text-gray-500">Create new Pinterest content</p>
            </div>
          </div>
        </Link>

        <Link href="/history" className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <History className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">View History</h3>
              <p className="text-sm text-gray-500">See your past generations</p>
            </div>
          </div>
        </Link>

        <Link href="/settings" className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <SettingsIcon className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
              <p className="text-sm text-gray-500">Manage your affiliate tag</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Generations</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentJobs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No generations yet. Click "New Generation" to get started.
            </div>
          ) : (
            recentJobs.map((job) => (
              <div key={job.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Niche: {job.niche}</p>
                  <p className="text-sm text-gray-500">{job.pinCount} products • {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <Link href={`/history/${job.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Results &rarr;
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
