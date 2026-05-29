"use client";

import { useTransition, useState } from "react";
import { generateContent } from "@/app/actions/generate";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";

export function GenerateForm({ defaultNiche, defaultPinCount }: { defaultNiche?: string, defaultPinCount?: number }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        await generateContent(formData);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred";
        if (message !== "NEXT_REDIRECT") {
          setError(message);
        }
      }
    });
  };

  return (
    <form action={handleSubmit} className="app-card max-w-3xl space-y-6 p-5 sm:p-7">
      <div className="flex items-start gap-4 border-b border-[var(--border)] pb-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--accent-soft)] text-[var(--accent)]">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-[var(--foreground)]">Campaign inputs</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Keep the niche specific for better product discovery and sharper Pinterest copy.
          </p>
        </div>
      </div>

      {error && (
        <div className="app-alert app-alert-danger text-sm font-semibold">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label htmlFor="niche" className="app-label">
          Niche / Keyword <span className="text-[var(--danger)]">*</span>
        </label>
        <input
          type="text"
          name="niche"
          id="niche"
          required
          defaultValue={defaultNiche || ""}
          placeholder="e.g. Minimalist Desk Setup"
          className="app-input"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="pinCount" className="app-label">
            Number of Products/Pins <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            type="number"
            name="pinCount"
            id="pinCount"
            required
            min="1"
            max="20"
            defaultValue={defaultPinCount || 5}
            className="app-input"
          />
        </div>

        <div>
          <label htmlFor="tone" className="app-label">
            Tone (Optional)
          </label>
          <select name="tone" id="tone" className="app-select">
            <option value="">Default (Natural)</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="professional">Professional</option>
            <option value="aesthetic">Aesthetic / Trendy</option>
            <option value="urgent">Urgent / Salesy</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="audience" className="app-label">
          Target Audience (Optional)
        </label>
        <input
          type="text"
          name="audience"
          id="audience"
          placeholder="e.g. College students, work-from-home professionals"
          className="app-input"
        />
      </div>

      <div className="border-t border-[var(--border)] pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="app-button-primary w-full gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating content...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate pins
            </>
          )}
        </button>
      </div>
    </form>
  );
}
