const fs = require('fs/promises');
const path = require('path');
const { ConfigService } = require('./configService');
const { fetchNewsForCategory } = require('./apiClient');
const { deduplicateArticles } = require('./deduplication');
const { HTMLBuilder } = require('./htmlBuilder');

function createFallbackArticles(category) {
  const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return [
    {
      title: `${category} roundup`,
      url: `https://example.com/${slug}/roundup`,
      source: 'Digest Fallback',
      category,
    }
  ];
}

function groupArticlesByCategory(categories, articles) {
  const grouped = new Map(categories.map((category) => [category, []]));

  for (const article of articles) {
    if (!grouped.has(article.category)) {
      grouped.set(article.category, []);
    }

    grouped.get(article.category).push(article);
  }

  for (const category of categories) {
    if (grouped.get(category).length === 0) {
      grouped.set(category, createFallbackArticles(category));
    }
  }

  return grouped;
}

async function generateDigest() {
  const config = ConfigService.getInstance();
  const categories = config.getCategories();
  const apiKey = config.getApiKey();

  console.log('Loading news articles...');

  const fetchedArticles = [];

  for (const category of categories) {
    try {
      const articles = await fetchNewsForCategory(category, apiKey);

      if (articles.length > 0) {
        fetchedArticles.push(...articles);
      } else {
        fetchedArticles.push(...createFallbackArticles(category));
      }
    } catch (error) {
      console.warn(`Falling back to sample articles for ${category}: ${error.message}`);
      fetchedArticles.push(...createFallbackArticles(category));
    }
  }

  const uniqueArticles = deduplicateArticles(fetchedArticles);
  const groupedArticles = groupArticlesByCategory(categories, uniqueArticles);

  const builder = new HTMLBuilder();
  builder.addHeader('Daily News Digest');

  for (const category of categories) {
    builder.addSection(category, groupedArticles.get(category));
  }

  builder.addFooter();

  const htmlContent = builder.build();
  const outputFile = config.getOutputFile();
  const outputDirectory = path.dirname(outputFile);

  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(outputFile, htmlContent, 'utf8');

  console.log(`Digest written to ${outputFile}`);
  return htmlContent;
}

module.exports = {
  generateDigest,
  createFallbackArticles,
  groupArticlesByCategory,
};
