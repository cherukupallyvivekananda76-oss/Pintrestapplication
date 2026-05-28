"use client";

import { useTransition, useRef, useState } from "react";
import { UserSettings } from "@prisma/client";
import { CheckCircle2, Loader2, Save, Settings2 } from "lucide-react";

export function SettingsForm({
  initialData,
  action
}: {
  initialData: UserSettings | null;
  action: (formData: FormData) => Promise<{ success: boolean }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    setMessage("");
    startTransition(async () => {
      try {
        await action(formData);
        setMessage("Settings saved successfully!");
      } catch (error: unknown) {
        setMessage(error instanceof Error ? error.message : "Failed to save settings.");
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      <div className="flex items-start gap-4 border-b border-[var(--border)] pb-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--accent-soft)] text-[var(--accent)]">
          <Settings2 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-[var(--foreground)]">Affiliate defaults</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            These values prefill generation and keep exported links consistent.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="affiliateTag" className="app-label">
          Amazon Affiliate Tag / Store ID
        </label>
        <p className="app-help">Used to build your affiliate links (e.g. yourname-20)</p>
        <input
          type="text"
          name="affiliateTag"
          id="affiliateTag"
          defaultValue={initialData?.affiliateTag || ""}
          pattern="^[a-zA-Z0-9]+-\d{2}$"
          title="Amazon Affiliate Tag should look like 'yourname-20'"
          className="app-input"
          placeholder="yourname-20"
        />
      </div>

      <div>
        <label htmlFor="defaultNiche" className="app-label">
          Default Niche
        </label>
        <input
          type="text"
          name="defaultNiche"
          id="defaultNiche"
          defaultValue={initialData?.defaultNiche || ""}
          className="app-input"
          placeholder="e.g. Home Decor"
        />
      </div>

      <div>
        <label htmlFor="defaultPinCount" className="app-label">
          Default Product Count
        </label>
        <input
          type="number"
          name="defaultPinCount"
          id="defaultPinCount"
          min="1"
          max="20"
          defaultValue={initialData?.defaultPinCount || 5}
          className="app-input"
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isPending}
          className="app-button-primary gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save settings
            </>
          )}
        </button>
        {message && (
          <span
            className={`inline-flex items-center gap-2 text-sm font-bold ${
              message.includes("success") ? "text-[var(--success)]" : "text-[var(--danger)]"
            }`}
          >
            {message.includes("success") && <CheckCircle2 className="h-4 w-4" />}
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
