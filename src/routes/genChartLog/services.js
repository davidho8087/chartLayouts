import { handleError } from '../../utils/errorHandler.js'
import { dbKnex } from '../../lib/dbConnection.js'
import logger from '../../lib/logger.js'

const parameterizedQuery = 'SELECT store_code AS name, COUNT(*) AS count FROM cameras GROUP BY store_code ORDER BY store_code ASC;'

// const sqlStatement2 = `
//     SELECT
//         customers.name,
//         COUNT(orders.id) AS total_orders,
//         SUM(orders.amount) AS total_spent
//     FROM
//         customers
//     JOIN
//         orders ON customers.id = orders.customer_id
//     GROUP BY
//         customers.id
//     HAVING
//         SUM(orders.amount) > 1000
//     ORDER BY
//         total_spent DESC;
// `;

export const createGenChartLog = async (data) => {
  const type = data.typeName
  const prompt = data.prompt

  logger.debug('createGenChartLog')
  try {
    const timestamp = new Date() // Current timestamp

    // TODO
    // Need to call AI to return sql statement and type

    const resultRawStatement = await dbKnex.raw(parameterizedQuery)

    const [insertedRecord] = await dbKnex('gen_chart_logs').insert({
      type,
      prompt,
      raw_sql_statement: parameterizedQuery, // Ensure parameterizedQuery is defined
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
  logger.info('deleteGenChartLog Service')
  try {
    return await dbKnex('gen_chart_logs')
      .where('id', id) // assuming 'id' is the column name for the ID
      .del()
  } catch (error) {
    handleError(error, 'deleteGenChartLog Service')
    throw error
  }
}

