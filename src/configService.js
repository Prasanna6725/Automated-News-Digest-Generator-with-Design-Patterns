const fs = require('fs');
const path = require('path');

class ConfigService {
  constructor(configPath) {
    this.configPath = configPath || path.resolve(process.cwd(), 'config.json');
    this.config = this.loadConfig();
  }

  static getInstance(configPath) {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService(configPath);
    }

    return ConfigService.instance;
  }

  static resetForTests() {
    ConfigService.instance = null;
  }

  loadConfig() {
    if (!fs.existsSync(this.configPath)) {
      throw new Error(`Configuration file not found at ${this.configPath}`);
    }

    const rawConfig = fs.readFileSync(this.configPath, 'utf8');
    const parsedConfig = JSON.parse(rawConfig);

    this.validateConfig(parsedConfig);

    return parsedConfig;
  }

  validateConfig(config) {
    if (!config || typeof config !== 'object') {
      throw new Error('Config file must contain a JSON object.');
    }

    if (typeof config.apiKey !== 'string') {
      throw new Error('Config apiKey must be a string.');
    }

    if (!Array.isArray(config.categories) || config.categories.length !== 5 || !config.categories.every((category) => typeof category === 'string' && category.trim().length > 0)) {
      throw new Error('Config categories must be an array of exactly 5 non-empty strings.');
    }

    if (typeof config.outputFile !== 'string' || config.outputFile.trim().length === 0) {
      throw new Error('Config outputFile must be a non-empty string.');
    }
  }

  getApiKey() {
    return this.config.apiKey;
  }

  getCategories() {
    return [...this.config.categories];
  }

  getOutputFile() {
    return this.config.outputFile;
  }
}

ConfigService.instance = null;

module.exports = { ConfigService };
