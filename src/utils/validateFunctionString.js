import { handleError } from './errorHandler.js'

export const validateFunctionString = (typeFunctionString) => {
  // Check if typeFunctionString is a string
  if (typeof typeFunctionString !== 'string') {
    const error = new Error('typeFunctionString must be a string')
    handleError(error, 'validateAndConvertFunctionString')
    throw error
  }

  try {
    const typeFunction = eval(`(${typeFunctionString})`)
    if (typeof typeFunction !== 'function') {
      throw new Error('Evaluated expression is not a function')
    }
    return typeFunction
  } catch (error) {
    handleError(error, 'Error parsing typeFunction string')
    throw error
  }
}
