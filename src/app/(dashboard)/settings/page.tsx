import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSettings } from "@/app/actions/settings";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your affiliate preferences and defaults.</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <SettingsForm initialData={settings} action={updateSettings} />
      </div>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800">Affiliate Compliance Notice</h4>
        <p className="mt-1 text-sm text-blue-600">
          You are responsible for ensuring that your use of affiliate links complies with the Amazon Associates Program Operating Agreement. Always include a clear affiliate disclosure (e.g., "As an Amazon Associate I earn from qualifying purchases") near your links when posting to Pinterest or other platforms.
        </p>
      </div>
    </div>
  );
}
