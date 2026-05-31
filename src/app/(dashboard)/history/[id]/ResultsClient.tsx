"use client";

import { GeneratedProduct, UserSettings } from "@prisma/client";
import { Download, Copy, Check, ExternalLink, Link as LinkIcon, Plus, AlertCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type GeneratedProductWithLinks = GeneratedProduct & {
  affiliateLinks?: {
    id: string;
    affiliateUrl: string;
    platform: string;
  }[];
};

export function ResultsClient({
  products,
  niche,
  settings
}: {
  products: GeneratedProductWithLinks[],
  niche: string,
  settings: UserSettings | null
}) {
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

  const handleGenerateAffiliate = async (e: React.FormEvent, productId: string, productUrl: string, productName: string) => {
    e.preventDefault();
    setGeneratingFor(productId);

    const formData = new FormData(e.target as HTMLFormElement);
    const platform = formData.get('platform') as string;

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

  const hasAnyTag = settings?.affiliateTag || settings?.genericAffiliateTag;

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4">
        <button
          onClick={exportCsv}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </button>
        <button
          onClick={exportJson}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </button>
      </div>

      <div className="grid gap-6">
        {localProducts.map((product) => (
          <div key={product.id} className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-64 h-64 bg-gray-100 relative flex-shrink-0">
              <Image
                src={product.imageUrl}
                alt={product.productTitle}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.generatedPinTitle}</h3>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  View Product <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>

              <p className="text-gray-700 mb-4 flex-1 whitespace-pre-wrap">{product.generatedDescription}</p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(product.keywordsJson || '[]').map((kw: string, i: number) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Affiliate Link Generation Section */}
              <div className="mb-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-1 text-gray-500"/>
                  Generate Platform Affiliate Link
                </h4>

                {!hasAnyTag ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mb-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          No affiliate tags found.
                          <Link href="/settings" className="font-medium underline ml-1 hover:text-yellow-600">
                            Add tags in Settings
                          </Link>
                          {" "}to automatically generate trackable links for this product.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => handleGenerateAffiliate(e, product.id, product.productUrl, product.productTitle)}
                    className="flex gap-2 items-end"
                  >
                    <div className="flex-1">
                      <select
                        name="platform"
                        required
                        className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white"
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
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 min-w-[120px]"
                    >
                      {generatingFor === product.id ? "Generating..." : "Generate Link"}
                    </button>
                  </form>
                )}

                {/* Display Custom Generated Links */}
                {product.affiliateLinks && product.affiliateLinks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {product.affiliateLinks.map(link => (
                      <div key={link.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200 text-sm">
                        <span className="font-medium text-gray-700 w-24 flex-shrink-0">{link.platform}:</span>
                        <div className="flex items-center gap-2 flex-1 mx-2 overflow-hidden">
                           <span className="truncate text-blue-600 font-mono text-xs">{link.affiliateUrl}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(link.affiliateUrl, link.id)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 flex-shrink-0"
                          title="Copy Link"
                        >
                           {copiedId === link.id ? (
                             <><Check className="mr-1.5 h-3 w-3 text-green-500" /> Copied</>
                           ) : (
                             <><Copy className="mr-1.5 h-3 w-3 text-gray-400" /> Copy</>
                           )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 truncate mr-2" title={product.affiliateUrl}>
                  Auto Link: {product.affiliateUrl.substring(0, 40)}...
                </span>

                <button
                  onClick={() => {
                    const contentToCopy = `${product.generatedPinTitle}\n\n${product.generatedDescription}\n\n${JSON.parse(product.keywordsJson || '[]').map((k: string) => `#${k}`).join(' ')}\n\nGet it here: ${product.affiliateUrl}`;
                    copyToClipboard(contentToCopy, product.id + '_main');
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
                >
                  {copiedId === product.id + '_main' ? (
                    <><Check className="mr-1.5 h-4 w-4 text-green-500" /> Copied!</>
                  ) : (
                    <><Copy className="mr-1.5 h-4 w-4 text-gray-400" /> Copy Pin Package</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
