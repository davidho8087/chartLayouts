import * as GenChartLogServices from '../genChartLog/services.js'
import * as GenChartServices from './services.js'
import * as UserServices from '../user/services.js'
import * as ChartTypeServices from '../chartType/services.js'
import * as Utils from '../../utils/validateFunctionString.js'
import logger from '../../lib/logger.js'
import { validateGenChartFunctionGroup } from '../../utils/validateFunctionString.js'


export const createGenChartController = async (req, res) => {
  logger.debug('createGenChartController')

  try {
    const data = req.body.data
    const genChartLogId = Number(data.genChartLogId)
    const userId = Number(data.userId)
    const typeName = data.typeName
    const prompt = data.prompt

    logger.debug('incoming', data)

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
    const genChartLogRecord = await GenChartLogServices.findOneGenChartLog(genChartLogId)

    if (!genChartLogRecord) {
      return res.status(404).json({
        status: 404,
        message: 'Chart log not found',
      })
    }

    const typeFunction = chartTypeRecord.function
    const rawSqlStatement = genChartLogRecord.raw_sql_statement

    // validate Function string
    const validEvalFunctionString = Utils.validateFunctionString(typeFunction)

    // compile rawSqlStatement
    const compiledSqlStatement = await GenChartServices.compileRawSqlStatement(rawSqlStatement)

    // compile sql statement with dynamic function string
    const compiledResult = await GenChartServices.dynamicFunctionToCompiledSqlStatement(
      compiledSqlStatement,
      validEvalFunctionString,
    )

    // Call the GenChart service to insert the new record
    const newRecord = await GenChartServices.createGenChart(
      genChartLogRecord,
      rawSqlStatement,
      userId,
      chartTypeRecord,
    )

    const responseRecord = {
      id: newRecord.id,
      prompt,
      typeName,
      typeFunction: chartTypeRecord.function,
      userId: userId,
      compiledResult: compiledResult,
    }

    res.status(200).json({
      status: 200,
      data: responseRecord,
      message: 'Chart created successfully',
    })

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to create chart: ${error.message}`,
    })

  }
}

export const findOneGenChartController = async (req, res) => {
  logger.debug('findOneGenChartController')

  try {
    const id = req.params.id
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
    res.status(500).send({
      status: 'error',
      message: error.message,
    })
  }
}

export const findAllByUserIdController = async (req, res) => {
  logger.debug('findAllByUserIdController')

  try {
    const userId = Number(req.params.id) // Assuming the id is passed as a URL parameter

    // First, find the user by userId
    const userRecord = await UserServices.findOneUser(userId)

    if (!userRecord) {
      return res.status(404).json({
        status: 404,
        message: `User with ID ${userId} not found`,
      })
    }

    // Call the GenChart service to find all records by userId
    const genCharts = await GenChartServices.findAllByUserId(userId)

    // Check if genCharts is an empty array
    if (genCharts.length === 0) {
      return res.status(404).json({
        status: 404,
        message: `No charts found for user with ID ${userId}`,
      })
    }

    const chartFuncErrorMessages = validateGenChartFunctionGroup(genCharts)

    if (chartFuncErrorMessages.length > 0) {
      throw new Error(`Validation errors found: ${chartFuncErrorMessages.join(', ')}`)
    }

    const responsePayload = []

    for (const genChart of genCharts) {
      const typeFunctionString = genChart.function  // Extract function string

      // Execute the function string using eval
      const typeFunction = eval(`(${typeFunctionString})`)
      const rawSqlStatement = genChart.raw_sql_statement  // Extract raw SQL statement

      // Compile rawSqlStatement
      const compiledSqlStatement = await GenChartServices.compileRawSqlStatement(rawSqlStatement)

      // Compile SQL statement with dynamic function string
      const compiledResult = await GenChartServices.dynamicFunctionToCompiledSqlStatement(
        compiledSqlStatement,
        typeFunction,
      )

      const eachResult = {
        id: genChart.id,
        prompt: genChart.prompt,
        typeName: genChart.type,
        compiledResult: compiledResult,
      }
      responsePayload.push(eachResult)
    }

    res.status(200).json({
      status: 200,
      data: responsePayload,
      message: 'Loaded successfully',
    })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: error.message,
    })
  }
}

