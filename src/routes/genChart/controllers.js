import * as GenChartLogServices from '../genChartLog/services.js'
import * as GenChartServices from './services.js'
import * as UserServices from '../user/services.js'
import * as ChartTypeServices from '../chartType/services.js'
import logger from '../../lib/logger.js'


export const createGenChartController = async (req, res) => {
  logger.debug('createGenChartController')
  try {
    const data = req.body.data
    const genChartLogId = data.genChartLogId
    const userId = data.userId
    const typeName = data.typeName

    logger.debug('', data)

    // First, find the user by userId
    const userRecord = await UserServices.findOneUser(userId)

    if (!userRecord) {
      return res.status(404).json({
        status: 404,
        message: `User with ID ${userId} not found`,
      })
    }

    const chartTypeRecord = await ChartTypeServices.findOneChartType(typeName)

    if (!chartTypeRecord) {
      return res.status(404).json({
        status: 404,
        message: `Chart Type ${typeName} not found`,
      })
    }

    // find genChartLog record

    // TODO
    const genChartLogRecord = await GenChartLogServices.findOneGenChartLog(genChartLogId, chartTypeRecord)

    if (!genChartLogRecord) {
      return res.status(404).json({
        status: 404,
        message: 'Chart log not found',
      })
    }

    // Extract the rawSqlStatement
    const rawSqlStatement = genChartLogRecord.raw_sql_statement

    // Call the GenChart service to insert the new record
    const newRecord = await GenChartServices.createGenChart(genChartLogRecord, rawSqlStatement)

    const responseResult = {
      ...newRecord,
      userId: userId,
    }

    console.log('Response from createGenChart:', responseResult)

    res.status(200).json({
      status: 200,
      data: responseResult,
      message: 'Chart created successfully',
    })

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create chart',
    })

  }
}

export const findOneGenChartController = async (req, res) => {
  logger.debug('findOneGenChartController')
  try {
    const id = req.params.id // Extract the ID from the URL parameter
    const record = await GenChartServices.findOneGenChart(id)

    if (!record) {
      return res.status(404).json({
        status: 404,
        message: 'chart not found',
      })
    }

    res.status(200).send({
      status: 'success',
      data: record,
      message: 'Chart found successfully',
    })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: error.message,
    })
  }
}

export const deleteGenChartController = async (req, res) => {
  logger.debug('deleteSmartLayoutController')
  try {
    const id = req.params.id // Assuming the id is passed as a URL parameter

    // First, find the record
    const genChartRecord = await GenChartServices.findOneGenChart(id)

    if (!genChartRecord) {
      return res.status(404).json({
        status: 404,
        message: 'Chart not found',
      })
    }

    // Call the SmartLayout service to delete the record
    const rowDeleted = await GenChartServices.deleteGenChart(id)

    if (rowDeleted === 0) {
      return res.status(404).send({
        status: 404,
        message: `No record found with the specified ID ${id}`,
      })
    }

    res.status(200).json({
      status: 200,
      message: 'Chart deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}
