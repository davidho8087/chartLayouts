import * as dotenv from 'dotenv'
dotenv.config()

import app from './server.js'
import { defaultSetting } from '../config.js'
import logger from './lib/logger.js'

const port = defaultSetting.port
const environment = defaultSetting.environment

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
  logger.info(`Server is running on ${environment} mode`)
  logger.info(`http://localhost:${port}`)
})
