import logger from '../lib/logger.js'
import * as SmartLayoutLogServices from '../services/smartLayoutLog.service.js'
export const createSmartLayout = async (req, res) => {
  logger.info('createSmartLayout')
  try {
    const { data } = req.body
    const result = await SmartLayoutLogServices.createSmartLayoutLog(data)

    logger.info('', result)

    return res.status(200).json({ status: 200, message: result })
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message })
  }
}
