import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GenerateForm } from "./GenerateForm";
import Link from "next/link";
import { AlertCircle, Sparkles } from "lucide-react";

export default async function GeneratePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id }
  });

  const missingTag = !settings?.affiliateTag;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="app-page-header">
        <p className="app-eyebrow">Generate</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="app-title">Generate pins</h1>
            <p className="app-subtitle mt-3">
              Enter a niche and produce product-backed Pinterest copy, keywords, and affiliate-ready links.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--muted-strong)] shadow-sm">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            AI-assisted workflow
          </div>
        </div>
      </div>

      {missingTag && (
        <div className="app-alert app-alert-danger">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Affiliate tag required</p>
            <p className="mt-1 text-sm leading-6">
              Set your Amazon Affiliate Tag before generating content.
              <Link href="/settings" className="ml-1 font-extrabold underline underline-offset-4">
                Open settings
              </Link>
            </p>
          </div>
        </div>
      )}

      {!missingTag && (
        <GenerateForm
          defaultNiche={settings?.defaultNiche || undefined}
          defaultPinCount={settings?.defaultPinCount}
        />
      )}
    </div>
  );
}
