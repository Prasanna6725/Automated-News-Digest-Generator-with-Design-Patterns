function normalizeUrl(url) {
  return String(url)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

function deduplicateArticles(articles) {
  const seenUrls = new Set();
  const uniqueArticles = [];

  for (const article of articles) {
    const normalizedUrl = normalizeUrl(article.url);

    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl);
      uniqueArticles.push(article);
    }
  }

  return uniqueArticles;
}

module.exports = {
  normalizeUrl,
  deduplicateArticles,
};
