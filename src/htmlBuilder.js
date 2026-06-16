function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

class HTMLBuilder {
  constructor() {
    this.parts = [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<title>Daily News Digest</title>',
      '<style>',
      'body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.6; color: #1f2933; background: #f8fafc; }',
      'main { max-width: 960px; margin: 0 auto; background: #ffffff; padding: 2rem; border-radius: 16px; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08); }',
      'h1 { margin-top: 0; }',
      'h2 { margin-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.35rem; }',
      'ul { padding-left: 1.2rem; }',
      'li { margin-bottom: 0.75rem; }',
      'footer { margin-top: 2rem; font-size: 0.9rem; color: #64748b; }',
      'a { color: #0f4c81; text-decoration: none; }',
      'a:hover { text-decoration: underline; }',
      '</style>',
      '</head>',
      '<body>',
      '<main>'
    ];
  }

  addHeader(title) {
    this.parts.push(`<h1>${escapeHtml(title)}</h1>`);
    return this;
  }

  addSection(category, articles) {
    this.parts.push('<section>');
    this.parts.push(`<h2>${escapeHtml(category)}</h2>`);
    this.parts.push('<ul>');

    for (const article of articles) {
      const title = escapeHtml(article.title);
      const url = escapeHtml(article.url);
      const source = escapeHtml(article.source || 'Unknown source');
      this.parts.push(`<li><a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a> <span>(${source})</span></li>`);
    }

    this.parts.push('</ul>');
    this.parts.push('</section>');
    return this;
  }

  addFooter() {
    this.parts.push(`<footer>Generated on ${escapeHtml(new Date().toISOString())}</footer>`);
    this.parts.push('</main>');
    this.parts.push('</body>');
    this.parts.push('</html>');
    return this;
  }

  build() {
    return this.parts.join('\n');
  }
}

module.exports = { HTMLBuilder };
