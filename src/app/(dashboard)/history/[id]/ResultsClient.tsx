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
        {products.map((product) => (
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

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Affiliate Link: {product.affiliateUrl.substring(0, 40)}...
                </span>

                <button
                  onClick={() => {
                    const contentToCopy = `${product.generatedPinTitle}\n\n${product.generatedDescription}\n\n${JSON.parse(product.keywordsJson || '[]').map((k: string) => `#${k}`).join(' ')}\n\nGet it here: ${product.affiliateUrl}`;
                    copyToClipboard(contentToCopy, product.id);
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {copiedId === product.id ? (
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
