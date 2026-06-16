const fs = require('fs');
const os = require('os');
const path = require('path');

describe('ConfigService', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'news-digest-config-'));
  const configPath = path.join(tempDir, 'config.json');

  beforeAll(() => {
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          apiKey: 'test-key',
          categories: ['technology', 'business', 'science', 'health', 'sports'],
          outputFile: path.join(tempDir, 'digest.html')
        },
        null,
        2
      )
    );
  });

  beforeEach(() => {
    process.env.CONFIG_PATH = configPath;
    jest.resetModules();
  });

  afterEach(() => {
    delete process.env.CONFIG_PATH;
  });

  test('returns the same instance every time', () => {
    const { ConfigService } = require('../src/configService');
    ConfigService.resetForTests();

    const firstInstance = ConfigService.getInstance();
    const secondInstance = ConfigService.getInstance();

    expect(firstInstance).toBe(secondInstance);
  });
});
