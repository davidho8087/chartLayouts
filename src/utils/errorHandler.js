import logger from '../lib/logger.js'

export const handleError = (error) => {
  logger.error('Error-Message:', error.message)

  const errorCode = error.code || (error.cause && error.cause.code)
  if (errorCode) {
    logger.error('Error-Code:', errorCode)
  }

  logger.error('Full-Error:', error)
}
