"use client";

import { GeneratedProduct } from "@prisma/client";
import { Download, Copy, Check, ExternalLink, Link as LinkIcon, Plus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

type GeneratedProductWithLinks = GeneratedProduct & {
  affiliateLinks?: {
    id: string;
    affiliateUrl: string;
    platform: string;
  }[];
};

export function ResultsClient({ products, niche }: { products: GeneratedProductWithLinks[], niche: string }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [localProducts, setLocalProducts] = useState<GeneratedProductWithLinks[]>(products);

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
    const rows = localProducts.map(p => [
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
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localProducts, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `${niche.replace(/\s+/g, '_')}_pins.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateAffiliate = async (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    setGeneratingFor(productId);

    const formData = new FormData(e.target as HTMLFormElement);
    const productUrl = formData.get('productUrl') as string;
    const platform = formData.get('platform') as string;
    const productName = formData.get('productName') as string;

    try {
      const res = await fetch('/api/affiliate/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche,
          productUrl,
          platform,
          pinId: productId,
          productName
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate affiliate link');
      }

      const newLink = await res.json();

      // Update local state to show the new link immediately
      setLocalProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            affiliateLinks: [...(p.affiliateLinks || []), newLink]
          };
        }
        return p;
      }));

      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      alert("Error generating affiliate link");
    } finally {
      setGeneratingFor(null);
    }
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
        {localProducts.map((product) => (
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

              <div className="mb-4 mt-6 border-t border-[var(--border)] pt-5">
                <h4 className="mb-2 flex items-center text-sm font-bold text-[var(--foreground)]">
                  <LinkIcon className="mr-1 h-4 w-4 text-[var(--muted)]" />
                  Generate Additional Affiliate Link
                </h4>
                <form
                  onSubmit={(e) => handleGenerateAffiliate(e, product.id)}
                  className="flex items-end gap-2"
                >
                  <div className="flex-1">
                    <input type="hidden" name="productName" value={product.productTitle} />
                    <input
                      type="url"
                      name="productUrl"
                      required
                      placeholder="https://..."
                      className="app-input text-sm"
                    />
                  </div>
                  <div className="w-32">
                    <select
                      name="platform"
                      required
                      className="app-input bg-white text-sm"
                    >
                      <option value="Amazon">Amazon</option>
                      <option value="ShareASale">ShareASale</option>
                      <option value="ClickBank">ClickBank</option>
                      <option value="CJ">CJ Affiliate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={generatingFor === product.id}
                    className="app-button-primary px-3 py-2"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                {product.affiliateLinks && product.affiliateLinks.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {product.affiliateLinks.map((link) => (
                      <div key={link.id} className="flex items-center justify-between rounded bg-[var(--surface-muted)] p-2 text-sm">
                        <span className="font-medium text-[var(--muted-strong)]">{link.platform}:</span>
                        <div className="flex items-center gap-2 flex-1 mx-2 overflow-hidden">
                          <span className="truncate text-[var(--accent)]">{link.affiliateUrl}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(link.affiliateUrl, link.id)}
                          className="p-1 text-[var(--muted)] hover:text-[var(--foreground)]"
                          title="Copy Link"
                        >
                          {copiedId === link.id ? <Check className="h-4 w-4 text-[var(--success)]" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-5 lg:flex-row lg:items-center lg:justify-between">
                <span className="break-all text-xs font-semibold leading-5 text-[var(--muted)]">
                  Affiliate Link: {product.affiliateUrl.substring(0, 40)}...
                </span>

                <button
                  onClick={() => {
                    const contentToCopy = `${product.generatedPinTitle}\n\n${product.generatedDescription}\n\n${JSON.parse(product.keywordsJson || '[]').map((k: string) => `#${k}`).join(' ')}\n\nGet it here: ${product.affiliateUrl}`;
                    copyToClipboard(contentToCopy, product.id + '_main');
                  }}
                  className="app-button-primary gap-2"
                >
                  {copiedId === product.id + '_main' ? (
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
