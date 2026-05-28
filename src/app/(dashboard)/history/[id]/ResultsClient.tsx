"use client";

import { GeneratedProduct } from "@prisma/client";
import { Download, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function ResultsClient({ products, niche }: { products: GeneratedProduct[], niche: string }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const exportCsv = () => {
    const headers = ["Title", "Description", "Keywords", "Affiliate Link", "Image URL"];
    const rows = products.map(p => [
      `"${p.generatedPinTitle?.replace(/"/g, '""') || ''}"`,
      `"${p.generatedDescription?.replace(/"/g, '""') || ''}"`,
      `"${JSON.parse(p.keywordsJson || '[]').join(', ')}"`,
      `"${p.affiliateUrl}"`,
      `"${p.imageUrl}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${niche.replace(/\s+/g, '_')}_pins.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `${niche.replace(/\s+/g, '_')}_pins.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          onClick={exportCsv}
          className="app-button-secondary gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
        <button
          onClick={exportJson}
          className="app-button-secondary gap-2"
        >
          <Download className="h-4 w-4" />
          Export JSON
        </button>
      </div>

      <div className="grid gap-6">
        {products.map((product) => (
          <article key={product.id} className="app-card overflow-hidden md:grid md:grid-cols-[17rem_1fr]">
            <div className="relative aspect-[4/3] bg-[var(--surface-muted)] md:aspect-auto md:min-h-72">
              <Image
                src={product.imageUrl}
                alt={product.productTitle}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex flex-col p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="app-eyebrow">Pin package</p>
                  <h3 className="mt-2 text-2xl font-black leading-tight text-[var(--foreground)]">{product.generatedPinTitle}</h3>
                  <p className="mt-2 text-sm font-semibold text-[var(--muted)] line-clamp-2">{product.productTitle}</p>
                </div>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-button-secondary shrink-0 gap-2"
                >
                  View product
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <p className="mt-5 flex-1 whitespace-pre-wrap text-sm leading-7 text-[var(--muted-strong)]">
                {product.generatedDescription}
              </p>

              <div className="mt-5">
                <div className="flex flex-wrap gap-2.5">
                  {JSON.parse(product.keywordsJson || '[]').map((kw: string, i: number) => (
                    <span key={i} className="app-badge bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-5 lg:flex-row lg:items-center lg:justify-between">
                <span className="break-all text-xs font-semibold leading-5 text-[var(--muted)]">
                  Affiliate Link: {product.affiliateUrl.substring(0, 40)}...
                </span>

                <button
                  onClick={() => {
                    const contentToCopy = `${product.generatedPinTitle}\n\n${product.generatedDescription}\n\n${JSON.parse(product.keywordsJson || '[]').map((k: string) => `#${k}`).join(' ')}\n\nGet it here: ${product.affiliateUrl}`;
                    copyToClipboard(contentToCopy, product.id);
                  }}
                  className="app-button-primary gap-2"
                >
                  {copiedId === product.id ? (
                    <><Check className="h-4 w-4" /> Copied!</>
                  ) : (
                    <><Copy className="h-4 w-4" /> Copy pin package</>
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
