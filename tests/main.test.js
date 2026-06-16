jest.mock('../src/apiClient', () => ({
  fetchNewsForCategory: jest.fn(),
}));

jest.mock('../src/configService', () => ({
  ConfigService: {
    getInstance: jest.fn(),
  },
}));

jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

const fsPromises = require('fs/promises');
const { fetchNewsForCategory } = require('../src/apiClient');
const { ConfigService } = require('../src/configService');
const { generateDigest } = require('../src/app');

describe('generateDigest', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    ConfigService.getInstance.mockReturnValue({
      getApiKey: () => 'test-key',
      getCategories: () => ['technology', 'business', 'science', 'health', 'sports'],
      getOutputFile: () => 'output/digest.html',
    });

    fetchNewsForCategory.mockImplementation(async (category) => ([
      {
        title: `${category} headline`,
        url: `https://example.com/${category}`,
        source: `${category} source`,
        category,
      },
      {
        title: `${category} duplicate`,
        url: `https://www.example.com/${category}`,
        source: `${category} duplicate source`,
        category,
      },
    ]));
  });

  test('uses mocked API data and writes the digest html', async () => {
    const html = await generateDigest();

    expect(fetchNewsForCategory).toHaveBeenCalledTimes(5);
    expect(fsPromises.mkdir).toHaveBeenCalledWith('output', { recursive: true });
    expect(fsPromises.writeFile).toHaveBeenCalledWith('output/digest.html', expect.any(String), 'utf8');
    expect(html).toContain('<h1>Daily News Digest</h1>');
    expect(html).toContain('<h2>technology</h2>');
    expect(html).toContain('<h2>business</h2>');
    expect(html).toContain('<li><a href="https://example.com/technology"');
  });
});
