import * as cheerio from 'cheerio';
import * as https from 'https';
import { Product, ProductProvider } from './types';

export class AmazonScraperProvider implements ProductProvider {
  async searchProducts(niche: string, count: number): Promise<Product[]> {
    const encodedNiche = encodeURIComponent(niche);
    const path = `/s?k=${encodedNiche}`;

    return new Promise((resolve, reject) => {
      https.get({
        hostname: 'www.amazon.com',
        path: path,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`Amazon returned status code ${res.statusCode}. Sourcing failed.`));
          }

          if (data.includes('api-services-support@amazon.com') || data.includes('captcha')) {
             return reject(new Error("Amazon bot protection triggered. Please configure official Amazon API credentials."));
          }

          const $ = cheerio.load(data);
          const products: Product[] = [];

          $('[data-component-type="s-search-result"]').each((i, el) => {
            if (products.length >= count) return; // Stop if we have enough

            const asin = $(el).attr('data-asin');
            if (!asin) return;

            const title = $(el).find('h2 span').text().trim();
            const image = $(el).find('img.s-image').attr('src');
            let url = $(el).find('h2 a').attr('href') || $(el).find('a.a-link-normal.s-no-outline').attr('href');

            if (url && !url.startsWith('http')) {
              url = 'https://www.amazon.com' + url;
            }

            if (asin && title && image && url) {
              products.push({
                id: asin,
                title: title,
                imageUrl: image,
                url: url,
                features: ["Real Amazon Product"] // We don't scrape deep features here to avoid multiple requests
              });
            }
          });

          if (products.length === 0) {
            return reject(new Error(`No real products found for niche: "${niche}". Please try a different niche.`));
          }

          resolve(products);
        });
      }).on('error', (err) => {
        reject(new Error(`Failed to contact Amazon: ${err.message}`));
      });
    });
  }
}
