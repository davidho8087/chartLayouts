import { handleError } from '../../utils/errorHandler.js'
import { dbKnex } from '../../lib/dbConnection.js'
import logger from '../../lib/logger.js'

const parameterizedQuery = 'SELECT * FROM outlets'
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

export const createSmartLayoutLog = async ({ type, prompt }) => {
  logger.debug('createSmartLayoutLog')
  logger.debug('type', type)
  logger.debug('prompt', prompt)
  try {
    // use parameterizedQuery to query
    // const result = await dbKnex.raw(parameterizedQuery)
    // return result.rows

    const timestamp = new Date(); // Current timestamp

    // TODO
    // Need to call AI to return sql statement and type

    const [insertedRecord] = await dbKnex('smart_layout_logs').insert({
      type,
      prompt,
      raw_sql_statement: parameterizedQuery, // Ensure parameterizedQuery is defined
      created_at: timestamp,
      updated_at: timestamp,
    }).returning('*');

    return insertedRecord; // return object

  } catch (error) {
    handleError(error)
    throw error
  }
}

export const findAllSmartLayoutLogs = async () => {
  logger.debug('findAllSmartLayoutLogs')
  try {
    return await dbKnex('smart_layout_log').select('*');
  } catch (error) {
    // logger.error('Error in findAllSmartLayoutLogs:', error);
    handleError(error, 'findAllSmartLayoutLogs');
    throw error;
  }
}

export const findOneSmartLayoutLog = async (id) => {
  logger.debug('findOneSmartLayoutLog')
  try {
    const record = await dbKnex('smart_layout_log').where('id', id).first();
    if (!record) {
      throw new Error('Record not found');
    }
    return record;
  } catch (error) {
    // logger.error('Error in findOneSmartLayoutLog:', err);
    handleError(error, 'findOneSmartLayoutLogService');
    throw error;
  }
}

export const deleteSmartLayoutLog = async (id) => {
  logger.info('deleteSmartLayoutLogService')
  try {
    const rowsDeleted = await dbKnex('smart_layout_log')
      .where('id', id) // assuming 'id' is the column name for the ID
      .del();

    if (rowsDeleted === 0) {
      throw new Error('No record found with the specified ID.');
    }

    return `Record with ID ${id} deleted`;
  } catch (error) {
    handleError(error, 'deleteSmartLayoutLogService');
    throw error;
  }
}

