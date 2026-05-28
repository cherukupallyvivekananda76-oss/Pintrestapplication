import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, History, PlusCircle, Settings as SettingsIcon, Sparkles } from "lucide-react";

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
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="app-page-header">
        <p className="app-eyebrow">Workspace</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="app-title">Dashboard</h1>
            <p className="app-subtitle mt-3">
              A focused command center for turning product niches into polished Pinterest affiliate content.
            </p>
          </div>
          <Link href="/generate" className="app-button-primary w-full gap-2 sm:w-auto">
            <PlusCircle className="h-4 w-4" />
            New generation
          </Link>
        </div>
      </div>

      {needsSetup && (
        <div className="app-alert app-alert-warning">
          <SettingsIcon className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Affiliate tag needed before generation</p>
            <p className="mt-1 text-sm leading-6">
              Add your Amazon Affiliate Tag so generated links include your tracking ID.
              <Link href="/settings" className="ml-1 font-extrabold underline underline-offset-4">
                Open settings
              </Link>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/generate" className="app-card-interactive block p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--accent-soft)] text-[var(--accent)]">
              <PlusCircle className="h-5 w-5" />
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-extrabold text-[var(--foreground)]">New generation</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Create fresh product picks, pin copy, and keywords.</p>
          </div>
        </Link>

        <Link href="/history" className="app-card-interactive block p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#ebe7dc] text-[var(--muted-strong)]">
              <History className="h-5 w-5" />
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-extrabold text-[var(--foreground)]">View history</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Review previous runs and export finished assets.</p>
          </div>
        </Link>

        <Link href="/settings" className="app-card-interactive block p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f5e6d3] text-[#8a5114]">
              <SettingsIcon className="h-5 w-5" />
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-extrabold text-[var(--foreground)]">Settings</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Manage affiliate defaults and generation preferences.</p>
          </div>
        </Link>
      </div>

      <div className="app-card overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-[var(--border)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="app-eyebrow">Activity</p>
            <h3 className="mt-1 text-lg font-extrabold text-[var(--foreground)]">Recent generations</h3>
          </div>
          <Link href="/history" className="text-sm font-extrabold text-[var(--accent)] hover:text-[var(--accent-strong)]">
            See all
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {recentJobs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-[var(--accent)]" />
              <h4 className="mt-4 text-base font-extrabold text-[var(--foreground)]">No generations yet</h4>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                Start with a niche, then come back here to compare and export your best content.
              </p>
              <Link href="/generate" className="app-button-primary mt-5 gap-2">
                <PlusCircle className="h-4 w-4" />
                Create your first run
              </Link>
            </div>
          ) : (
            recentJobs.map((job) => (
              <div key={job.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-extrabold capitalize text-[var(--foreground)]">Niche: {job.niche}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {job.pinCount} products • {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link href={`/history/${job.id}`} className="app-button-secondary gap-2 self-start sm:self-auto">
                  View results
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
