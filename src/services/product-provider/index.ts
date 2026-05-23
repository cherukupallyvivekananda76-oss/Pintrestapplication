import { ProductProvider } from "./types";
import { MockProductProvider } from "./mock-provider";

// TODO: Replace with real Amazon provider when API access is available
// For now, we use the mock provider to ensure the app is fully runnable end-to-end
export const getProductProvider = (): ProductProvider => {
  return new MockProductProvider();
};
