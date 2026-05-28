import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSettings } from "@/app/actions/settings";
import { SettingsForm } from "./SettingsForm";
import { ShieldCheck } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id }
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="app-page-header">
        <p className="app-eyebrow">Preferences</p>
        <h1 className="app-title">Settings</h1>
        <p className="app-subtitle mt-3">Manage your affiliate preferences and generation defaults.</p>
      </div>

      <div className="app-card p-5 sm:p-7">
        <SettingsForm initialData={settings} action={updateSettings} />
      </div>

      <div className="app-alert app-alert-info">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <h4 className="text-sm font-extrabold">Affiliate compliance notice</h4>
          <p className="mt-1 text-sm leading-6">
          You are responsible for ensuring that your use of affiliate links complies with the Amazon Associates Program Operating Agreement. Always include a clear affiliate disclosure, such as &quot;As an Amazon Associate I earn from qualifying purchases&quot;, near your links when posting to Pinterest or other platforms.
          </p>
        </div>
      </div>
    </div>
  );
}
