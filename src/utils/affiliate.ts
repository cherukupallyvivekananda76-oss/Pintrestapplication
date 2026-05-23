/**
 * Builds an Amazon affiliate link by appending the user's affiliate tag.
 *
 * @param productUrl The raw Amazon product URL (e.g. https://www.amazon.com/dp/B08XJG8KVG)
 * @param affiliateTag The user's Amazon Associate Store ID / Tracking Tag
 * @returns The formatted affiliate URL
 */
export function buildAffiliateLink(productUrl: string, affiliateTag?: string | null): string {
  if (!productUrl) return "";

  try {
    const url = new URL(productUrl);

    // If there's an affiliate tag, add/replace it in the query parameters
    if (affiliateTag) {
      url.searchParams.set("tag", affiliateTag);
    }

    return url.toString();
  } catch (error) {
    // Fallback if URL parsing fails
    console.error("Failed to parse URL:", productUrl);
    if (affiliateTag) {
      const separator = productUrl.includes("?") ? "&" : "?";
      return `${productUrl}${separator}tag=${affiliateTag}`;
    }
    return productUrl;
  }
}
