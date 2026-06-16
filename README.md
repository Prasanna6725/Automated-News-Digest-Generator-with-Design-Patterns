# Automated News Digest Builder

This project is a Node.js command-line application that fetches top news headlines, removes duplicate articles, and generates a daily HTML digest. It demonstrates the Singleton pattern for configuration management and the Builder pattern for HTML generation.

## Setup

1. Install Node.js dependencies with `npm install`.
2. Copy `config.json.example` to `config.json` in the project root.
3. Add your news API key to `config.json`.

## Configuration

`config.json` must contain exactly five categories and an output file path.

```json
{
  "apiKey": "YOUR_API_KEY_HERE",
  "categories": ["technology", "business", "science", "health", "sports"],
  "outputFile": "output/digest.html"
}
```

## Running the Application

Run the digest generator with:

```bash
npm start
```

The command reads `config.json`, fetches the news, deduplicates articles, and writes the HTML digest to the configured output path.

## Running Tests

Run the unit test suite with:

```bash
npm test
```
