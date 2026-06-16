const https = require('https');

function requestJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let responseBody = '';

        response.on('data', (chunk) => {
          responseBody += chunk;
        });

        response.on('end', () => {
          if (response.statusCode && response.statusCode >= 400) {
            reject(new Error(`News API request failed with status ${response.statusCode}`));
            return;
          }

          try {
            resolve(JSON.parse(responseBody));
          } catch (error) {
            reject(new Error('Failed to parse news API response.'));
          }
        });
      })
      .on('error', reject);
  });
}

async function fetchNewsForCategory(category, apiKey) {
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('A valid API key is required to fetch live news.');
  }

  const requestUrl = new URL('https://gnews.io/api/v4/top-headlines');
  requestUrl.searchParams.set('category', category);
  requestUrl.searchParams.set('lang', 'en');
  requestUrl.searchParams.set('max', '10');
  requestUrl.searchParams.set('apikey', apiKey);

  const response = await requestJson(requestUrl.toString());
  const articles = Array.isArray(response.articles) ? response.articles : [];

  return articles.map((article) => ({
    title: article.title || 'Untitled article',
    url: article.url || '',
    source: article.source && article.source.name ? article.source.name : 'Unknown source',
    category,
  })).filter((article) => article.url);
}

module.exports = { fetchNewsForCategory };
