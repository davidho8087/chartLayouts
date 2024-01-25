import * as GenChartLogServices from '../genChartLog/services.js'
import * as ChartTypeServices from '../chartType/services.js'
import logger from '../../lib/logger.js'

export const createGenChartLogController = async (req, res) => {
  logger.debug('createSmartLayoutLogController')
  const data = req.body.data
  const typeName = data.typeName

  try {
    const chartTypeRecord = await ChartTypeServices.findOneChartType(typeName)

    if (!chartTypeRecord) {
      return res.status(404).send({
        status: 404,
        message: `Chart type ${data.type} not found.`,
      })
    }

    logger.debug('data', data)
    const newRecord = await GenChartLogServices.createGenChartLog(data)

    const responseRecord = {
      id: newRecord.id,
      prompt: newRecord.prompt,
      typeName,
      typeFunction: chartTypeRecord.function,
      raw_sql_statement: newRecord.raw_sql_statement,
      smartLayoutLogId: newRecord.id,
      dataSet: newRecord.dataSet,
    }

    res.status(201).send({
      status: 'success',
      data: responseRecord,
      message: 'New chart log created successfully.',
    })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: error.message,
    })
  }
}

export const findAllGenChartLogController = async (req, res) => {
  logger.debug('findAllGenChartLogController')

  try {
    const records = await GenChartLogServices.findAllGenChartLogs()
    res.status(200).send({
      status: 'success',
      data: records,
    })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: error.message,
    })
  }
}

export const findOneGenChartLogController = async (req, res) => {
  logger.debug('findOneGenChartLogController')
  const id = req.params.id

  try {
    const record = await GenChartLogServices.findOneGenChartLog(id)

    if (!record) {
      return res.status(404).send({
        status: 404,
        message: `No record found with the specified ID ${id}`,
      })
    }

    res.status(200).send({
      status: 'success',
      data: record,
    })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: error.message,
    })
  }
}

export const deleteGenChartLogController = async (req, res) => {
  logger.debug('deleteGenChartLogController')
  const id = req.params.id

  try {
    const rowDeleted = await GenChartLogServices.deleteGenChartLog(id)

    if (rowDeleted === 0) {
      return res.status(404).send({
        status: 404,
        message: `No record found with the specified ID ${id}`,
      })
    }

    res.status(200).send({
      status: 'success',
      message: `Record with ID ${id} deleted`,
    })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: error.message,
    })
  }
}

