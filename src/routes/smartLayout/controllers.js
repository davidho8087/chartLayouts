import * as SmartLayoutLogServices from '../smartLayoutLog/services.js'
import logger from '../../lib/logger.js'
import * as SmartLayoutService from './services.js'
export const createSmartLayoutController = async (req, res) => {
  logger.debug('createSmartLayoutController')
  try {
    const { data } = req.body
    logger.debug('', data)

    const smartLayoutLogId = data.smartLayoutLogId;

    // Fetch the smartLayoutLog record
    const smartLayoutLog = await SmartLayoutLogServices.findOneSmartLayoutLog(smartLayoutLogId);
    if (!smartLayoutLog) {
      throw new Error('SmartLayoutLog not found');
    }

    // Extract the rawSqlStatement
    const rawSqlStatement = smartLayoutLog.raw_sql_statement;

    // Create payload for SmartLayout
    const smartLayoutPayload = {
      ...data,
      rawSqlStatement: rawSqlStatement
    };

    // Call the SmartLayout service to insert the new record
    const smartLayoutResult = await SmartLayoutService.createSmartLayout(smartLayoutPayload);


    return res.status(200).json({
      status: 200,
      data: smartLayoutResult,
      message: "Smart Layout created successfully"
    });

  } catch (error) {
    logger.error('apa Error', error)
    return res.status(400).json({ status: 400, message: error.message })
  }
}
