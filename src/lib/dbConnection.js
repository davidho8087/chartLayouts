// dbConnection.js
import knex from 'knex'
import { dbConfig } from '../../config.js'
import logger from './logger.js' // Adjust this path to where your config.js is located

// Postgres Pool configuration
// const pool = new Pool({
//   host: 'localhost',
//   user: 'database-user',
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// })

// Knex configuration
const dbKnex = knex(dbConfig)


// Function to check Knex connection
async function checkKnexConnection() {
  try {
    // Perform a simple query to check the connection
    const result = await dbKnex.raw('SELECT NOW()')

    logger.debug('Knex connection established, current time:', result.rows[0].now)
    return true
  } catch (error) {
    logger.error('Error establishing Knex connection:', error.message)
    return false
  }
}


// Export both pool and knexInstance
export { dbKnex, checkKnexConnection }
