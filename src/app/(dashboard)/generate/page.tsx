import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GenerateForm } from "./GenerateForm";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default async function GeneratePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id }
  });

  const missingTag = !settings?.affiliateTag;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generate Pins</h1>
        <p className="mt-2 text-gray-600">Enter a niche and let AI find products and write Pinterest copy for you.</p>
      </div>

      {missingTag && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                You must set your Amazon Affiliate Tag before generating content.
                <Link href="/settings" className="font-medium underline ml-1 hover:text-red-600">
                  Go to Settings
                </Link>
              </p>
            </div>
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
