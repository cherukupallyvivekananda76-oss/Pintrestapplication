export interface Product {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  price?: string;
  features: string[];
}

export interface ProductProvider {
  searchProducts(niche: string, count: number): Promise<Product[]>;
}
