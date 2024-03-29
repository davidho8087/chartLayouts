import { handleError } from '../../utils/errorHandler.js'
import { dbKnex } from '../../lib/dbConnection.js'
import logger from '../../lib/logger.js'
import { mockSQLStatement }  from '../../mock.js'

export const createGenChartLog = async (data) => {
  logger.debug('createGenChartLog')


  const rawSqlStatement = mockSQLStatement.rawSqlStatement
  const type = data.typeName
  const prompt = data.prompt

  console.log('rawSqlStatement', rawSqlStatement)

  try {
    const timestamp = new Date() // Current timestamp

    // TODO Need to call AI to return sql statement and type
    const resultRawStatement = await dbKnex.raw(rawSqlStatement)

    const [insertedRecord] = await dbKnex('gen_chart_logs').insert({
      type,
      prompt,
      raw_sql_statement: rawSqlStatement, // Ensure parameterizedQuery is defined
      created_at: timestamp,
      updated_at: timestamp,
    }).returning('*')

    return {
      ...insertedRecord, // Spread the properties of insertedRecord
      dataSet: resultRawStatement.rows, // Add resultRawStatement as a new property
    }
  } catch (error) {
    handleError(error)
    throw error
  }
}

export const findAllGenChartLogs = async () => {
  logger.debug('findAllGenChartLogs Service')

  try {
    return await dbKnex('gen_chart_logs').select('*')
  } catch (error) {
    handleError(error, 'findAllGenChartLogs Service')
    throw error
  }
}

export const findOneGenChartLog = async (id) => {
  logger.debug('findOneGenChartLog Service')

  try {
    return await dbKnex('gen_chart_logs').where('id', id).first()
  } catch (error) {
    handleError(error, 'findOneGenChartLog Service')
    throw error
  }
}

export const deleteGenChartLog = async (id) => {
  logger.debug('deleteGenChartLog Service')
  
  try {
    return await dbKnex('gen_chart_logs')
      .where('id', id) // assuming 'id' is the column name for the ID
      .del()
  } catch (error) {
    handleError(error, 'deleteGenChartLog Service')
    throw error
  }
}

