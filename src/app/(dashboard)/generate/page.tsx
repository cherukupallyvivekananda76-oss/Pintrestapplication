import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GenerateForm } from "./GenerateForm";

export default async function GeneratePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generate Pins</h1>
        <p className="mt-2 text-gray-600">Enter a niche and let AI find products and write Pinterest copy for you.</p>
      </div>

      <GenerateForm
        defaultNiche={settings?.defaultNiche || undefined}
        defaultPinCount={settings?.defaultPinCount}
      />
    </div>
  );
}
