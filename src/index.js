// index.js

import * as dotenv from 'dotenv'
dotenv.config()

import app from './server.js'
import { defaultSetting } from '../config.js'
import logger from './lib/logger.js'
import { checkKnexConnection } from './lib/dbConnection.js'

const port = defaultSetting.port
const environment = defaultSetting.environment

// Check database connection before starting the server
checkKnexConnection()
  .then((isConnected) => {
    if (isConnected) {
      app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
        logger.info(`Server is running in ${environment} mode`);
        logger.info(`http://localhost:${port}`);
      });
    } else {
      logger.error('Failed to establish database connection. Exiting...');
      process.exit(1);
    }
  })
  .catch(err => {
    logger.error(`Error during database check: ${err.message}`);
  });