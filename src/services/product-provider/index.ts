import { ProductProvider } from "./types";
import { AmazonScraperProvider } from "./amazon-scraper";

export const getProductProvider = (): ProductProvider => {
  // Use real scraper instead of mock provider.
  // In a full production app, this would switch between Amazon PA API, Creators API, etc.
  // based on environment variables.
  return new AmazonScraperProvider();
};
