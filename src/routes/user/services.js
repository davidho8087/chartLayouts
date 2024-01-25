import logger from '../../lib/logger.js'
import { dbKnex } from '../../lib/dbConnection.js'
import { handleError } from '../../utils/errorHandler.js'

export const findOneUser = async (userId) => {
  logger.debug('findOneUser Service')
  try {
    return await dbKnex('up_users').where({ id: userId }).first()
  } catch (error) {
    handleError(error, 'findOneUser Service')
    throw error
  }
}