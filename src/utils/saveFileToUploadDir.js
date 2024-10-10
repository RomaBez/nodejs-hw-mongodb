import path from 'node:path';
import fs from 'node:fs/promises';
import { UPLOAD_DIR, TEMP_UPLOAD_DIR } from '../constants/index.js';

export const saveToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );
  return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
};
