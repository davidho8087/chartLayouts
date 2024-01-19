import { handleError } from '../utils/errorHandler.js'

const parameterizedQuery = 'SELECT * FROM store_outlet'
export const createSmartLayoutLog = async (data) => {
  try {
    // insert data into database table smart
  } catch (error) {
    // Handle the error as needed
    // Handle both local and propagated errors in the same way
    handleError(error)
    // Optionally rethrow the error if you want to handle it outside of this function
    throw error
  }
}
