const { deduplicateArticles, normalizeUrl } = require('../src/deduplication');

describe('deduplication', () => {
  test('normalizes URLs and removes duplicate articles', () => {
    expect(normalizeUrl('HTTPS://WWW.Example.com/')).toBe('example.com');

    const sampleArticles = [
      { title: 'First article', url: 'http://example.com/news/', source: 'Source A', category: 'technology' },
      { title: 'Duplicate article', url: 'https://www.example.com/news', source: 'Source B', category: 'business' },
      { title: 'Unique article', url: 'https://example.com/science', source: 'Source C', category: 'science' }
    ];

    const uniqueArticles = deduplicateArticles(sampleArticles);

    expect(uniqueArticles).toHaveLength(2);
    expect(uniqueArticles).toEqual([
      sampleArticles[0],
      sampleArticles[2]
    ]);
  });
});
