
import * as SmartLayoutLogServices from '../smartLayoutLog/services.js'
import logger from '../../lib/logger.js'


export const createSmartLayoutLogController = async (req, res) => {
  logger.debug('createSmartLayoutLogController');
  const { data } = req.body
  try {
    const newRecord  = await SmartLayoutLogServices.createSmartLayoutLog(data);

    const responseRecord = {
      ...newRecord,
      smartLayoutLogId: newRecord.id
    };

    res.status(201).send({
      status: 'success',
      data: responseRecord,
      message: 'New smart layout log created successfully.'
    });
  } catch (err) {
    res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
};

export const findAllSmartLayoutLogController = async (req, res) => {
  logger.debug('findAllSmartLayoutLogController');
  try {
    const records = await SmartLayoutLogServices.findAllSmartLayoutLogs();
    res.status(200).send({
      status: 'success',
      data: records
    });
  } catch (err) {
    res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
};

export const findOneSmartLayoutLogController = async (req, res) => {
  logger.debug('findOneSmartLayoutLogController');
  const smartLayoutLogId = req.params.id;

  try {
    const record = await SmartLayoutLogServices.findOneSmartLayoutLog(smartLayoutLogId);
    res.status(200).send({
      status: 'success',
      data: record
    });
  } catch (error) {
    res.status(404).send({
      status: 'error',
      message: error.message
    });
  }
};

export const deleteSmartLayoutLogController = async (req, res) => {
  logger.debug('deleteSmartLayoutLogController')
  const smartLayoutLogId = req.params.id
  try {
    const responseMessage = await SmartLayoutLogServices.deleteSmartLayoutLog(smartLayoutLogId);
    res.status(200).send({
      status: 'success',
      message: responseMessage
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: error.message
    });
  }
}

