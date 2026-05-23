"use client";

import { useTransition, useRef, useState } from "react";
import { UserSettings } from "@prisma/client";

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
      } catch (error) {
        setMessage("Failed to save settings.");
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="affiliateTag" className="block text-sm font-medium text-gray-700">
          Amazon Affiliate Tag / Store ID
        </label>
        <p className="text-xs text-gray-500 mb-1">Used to build your affiliate links (e.g. yourname-20)</p>
        <input
          type="text"
          name="affiliateTag"
          id="affiliateTag"
          defaultValue={initialData?.affiliateTag || ""}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="yourname-20"
        />
      </div>

      <div>
        <label htmlFor="defaultNiche" className="block text-sm font-medium text-gray-700">
          Default Niche
        </label>
        <input
          type="text"
          name="defaultNiche"
          id="defaultNiche"
          defaultValue={initialData?.defaultNiche || ""}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="e.g. Home Decor"
        />
      </div>

      <div>
        <label htmlFor="defaultPinCount" className="block text-sm font-medium text-gray-700">
          Default Product Count
        </label>
        <input
          type="number"
          name="defaultPinCount"
          id="defaultPinCount"
          min="1"
          max="20"
          defaultValue={initialData?.defaultPinCount || 5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Settings"}
        </button>
        {message && (
          <span className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
