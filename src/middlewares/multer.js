import multer from 'multer';

import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log('File destination:', TEMP_UPLOAD_DIR);
    callback(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now();
    console.log('Saving file as:', `${uniqueSuffix}_${file.originalname}`);
    callback(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const limits = { fileSize: 1024 * 1024 * 5 };

const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split('.').pop();
  console.log('Uploading file:', file.originalname, 'Extension:', extension);
  if (extension === 'exe') {
    return callback(createHttpError(400, '.exe files are not valid'));
  }
  callback(null, true);
};

export const uploadPhoto = multer({ storage, limits, fileFilter });
