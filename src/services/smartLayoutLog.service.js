import { handleError } from '../utils/errorHandler.js'
import { dbKnex } from '../lib/dbConnection.js'

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

  try {
    // use parameterizedQuery to query
    // const result = await dbKnex.raw(parameterizedQuery)
    // return result.rows

    const timestamp = new Date(); // Current timestamp

    return await dbKnex('smart_layout_logs').insert({
      type,
      prompt,
      raw_sql_statement: parameterizedQuery,
      created_at: timestamp,
      updated_at: timestamp,
    }).returning('*'); // Adjust according to your needs

  } catch (error) {
    handleError(error)
    throw error
  }
}
