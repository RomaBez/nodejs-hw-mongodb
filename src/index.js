import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { createDirIfNotExist } from './utils/createDirIfNotExists.js';

const bootstrap = async () => {
  await initMongoConnection();
  console.log('Temporary upload directory:', TEMP_UPLOAD_DIR);
  await createDirIfNotExist(TEMP_UPLOAD_DIR);
  await createDirIfNotExist(UPLOAD_DIR);

  setupServer();
};

bootstrap();
