const https = require('https');
https.get({
  hostname: 'www.amazon.com',
  path: '/s?k=shirts',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
}, (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Body length:', data.length);
    console.log('Contains captcha?', data.includes('captcha') || data.includes('api-services-support@amazon.com'));
  });
}).on('error', (e) => {
  console.error(e);
});
