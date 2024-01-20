import * as SmartLayoutLogServices from '../smartLayoutLog/services.js'
import logger from '../../lib/logger.js'
export const createSmartLayoutController = async (req, res) => {
  logger.info('createSmartLayoutController')
  try {
    const { data } = req.body
    const result = await SmartLayoutLogServices.createSmartLayoutLog(data)

    logger.info('', result)

    return res.status(200).json({ status: 200, message: result })
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message })
  }
}
