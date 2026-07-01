const fs = require('fs/promises');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

async function ensureFile(fileName, fallback = []) {
  const filePath = path.join(dataDir, fileName);

  try {
    await fs.access(filePath);
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2));
  }

  return filePath;
}

async function readCollection(fileName, fallback = []) {
  const filePath = await ensureFile(fileName, fallback);
  const contents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(contents || '[]');
}

async function writeCollection(fileName, data) {
  const filePath = await ensureFile(fileName, data);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return data;
}

module.exports = {
  readCollection,
  writeCollection,
};
