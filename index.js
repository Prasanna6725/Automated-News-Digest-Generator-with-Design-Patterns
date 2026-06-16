const { generateDigest } = require('./src/app');

generateDigest().catch((error) => {
  console.error('Failed to generate digest:', error.message);
  process.exitCode = 1;
});
