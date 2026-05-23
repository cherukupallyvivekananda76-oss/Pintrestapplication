"use client";

import { useTransition, useState } from "react";
import { generateContent } from "@/app/actions/generate";

export function GenerateForm({ defaultNiche, defaultPinCount }: { defaultNiche?: string, defaultPinCount?: number }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        await generateContent(formData);
      } catch (err: any) {
        if (err.message !== "NEXT_REDIRECT") {
          setError(err.message || "An error occurred");
        }
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border shadow-sm">
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}

      <div>
        <label htmlFor="niche" className="block text-sm font-medium text-gray-700">
          Niche / Keyword <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="niche"
          id="niche"
          required
          defaultValue={defaultNiche || ""}
          placeholder="e.g. Minimalist Desk Setup"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label htmlFor="pinCount" className="block text-sm font-medium text-gray-700">
          Number of Products/Pins <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="pinCount"
          id="pinCount"
          required
          min="1"
          max="20"
          defaultValue={defaultPinCount || 5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
          Target Audience (Optional)
        </label>
        <input
          type="text"
          name="audience"
          id="audience"
          placeholder="e.g. College students, Work from home professionals"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
          Tone (Optional)
        </label>
        <select
          name="tone"
          id="tone"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
        >
          <option value="">Default (Natural)</option>
          <option value="enthusiastic">Enthusiastic</option>
          <option value="professional">Professional</option>
          <option value="aesthetic">Aesthetic / Trendy</option>
          <option value="urgent">Urgent / Salesy</option>
        </select>
      </div>

      <div className="pt-4 border-t">
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isPending ? "Generating Content..." : "Generate Pins"}
        </button>
      </div>
    </form>
  );
}
