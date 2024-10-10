import * as fs from 'node:fs/promises';

export const createDirIfNotExist = async (path) => {
  try {
    await fs.access(path);
    console.log('Directory exists:', path);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Creating directory:', path);

      await fs.mkdir(path);
    } else {
      console.error('Error accessing directory:', error);
    }
  }
};
