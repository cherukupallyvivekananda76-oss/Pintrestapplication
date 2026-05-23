import { Product, ProductProvider } from "./types";

export class MockProductProvider implements ProductProvider {
  async searchProducts(niche: string, count: number): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const products: Product[] = [];

    for (let i = 1; i <= count; i++) {
      products.push({
        id: `B0${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        title: `Premium ${niche.charAt(0).toUpperCase() + niche.slice(1)} - Model ${i} with Advanced Features`,
        url: `https://www.amazon.com/dp/B0${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        imageUrl: `https://picsum.photos/seed/${niche}${i}/400/400`, // Placeholder image
        price: `$${(Math.random() * 100 + 10).toFixed(2)}`,
        features: [
          "High quality materials",
          "Durable and long-lasting",
          "Easy to use and maintain",
          "Perfect for daily use"
        ]
      });
    }

    return products;
  }
}
