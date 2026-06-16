const { HTMLBuilder } = require('../src/htmlBuilder');

describe('HTMLBuilder', () => {
  test('builds HTML incrementally with header and section content', () => {
    const builder = new HTMLBuilder();
    const html = builder
      .addHeader('Daily News Digest')
      .addSection('Technology', [
        { title: 'Tech article', url: 'https://example.com/tech', source: 'Tech Source' }
      ])
      .addFooter()
      .build();

    expect(html).toContain('<h1>Daily News Digest</h1>');
    expect(html).toContain('<h2>Technology</h2>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li><a href="https://example.com/tech"');
    expect(html).toContain('Tech article');
  });
});
