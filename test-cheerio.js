const cheerio = require('cheerio');
const https = require('https');

https.get({
  hostname: 'www.amazon.com',
  path: '/s?k=shirts',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const products = [];
    $('.s-result-item[data-asin]').each((i, el) => {
      const asin = $(el).attr('data-asin');
      if (!asin) return;

      const title = $(el).find('h2 a span').text().trim();
      const image = $(el).find('.s-image').attr('src');
      let url = $(el).find('h2 a').attr('href');

      if (url && !url.startsWith('http')) {
        url = 'https://www.amazon.com' + url;
      }

      if (asin && title && image) {
        products.push({ asin, title, image, url });
      }
    });
    console.log(products.slice(0, 2));
  });
});
