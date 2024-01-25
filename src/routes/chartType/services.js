import logger from '../../lib/logger.js'
import { dbKnex } from '../../lib/dbConnection.js'
import { handleError } from '../../utils/errorHandler.js'

export const findOneChartType = async (typeName) => {
  logger.debug('findOneChartType Service')
  try {
    return await dbKnex('chart_types').where({ type: typeName }).first()
  } catch (error) {
    handleError(error, 'findOneChartType Service')
    throw error
  }
}
