// Service.js
import logger from '../../lib/logger.js'
import { dbKnex } from '../../lib/dbConnection.js'
import { handleError } from '../../utils/errorHandler.js'

export const createGenChart = async (genChartLogRecord, rawSqlStatement, userId, chartTypeRecord) => {
  logger.debug('createGenChart Service')

  const { prompt, type } = genChartLogRecord
  let newGenChart = null
  const timestamp = new Date() // Current timestamp
  const typeFunction = chartTypeRecord.function
  const typeId = chartTypeRecord.id

  try {
    await dbKnex.transaction(async trx => {
      // Insert the new smart layout record
      [newGenChart] = await trx('gen_charts').insert({
        prompt,
        type,
        type_id: typeId,
        function: typeFunction,
        raw_sql_statement: rawSqlStatement,
        created_at: timestamp,
        updated_at: timestamp,
      }).returning('*')

      // Calculate the next gen_chart_order for the user
      const maxOrderResult = await trx('gen_charts_users_permissions_user_links')
        .where('user_id', userId)
        .max('gen_chart_order as maxOrder')
        .first()

      const nextOrder = maxOrderResult.maxOrder !== null ? maxOrderResult.maxOrder + 1 : 1

      // Insert the link with the new order
      await trx('gen_charts_users_permissions_user_links').insert({
        gen_chart_id: newGenChart.id, user_id: userId, gen_chart_order: nextOrder,
      })
    })
  } catch (error) {
    // This catch block will handle any errors thrown from the transaction
    handleError(error, 'createGenChart Service')
    throw error
  }
  return newGenChart
}


export const findOneGenChart = async (genChartId) => {
  logger.debug('findOneGenChart Service')

  try {
    return await dbKnex('gen_charts').where({ id: genChartId }).first()
  } catch (error) {
    handleError(error, 'findOneGenChart Service')
    throw error
  }
}

export const findAllByUserId = async (userId) => {
  logger.debug('findAllByUserId Service')

  try {
    return await dbKnex('gen_charts')
      .select(
        'gen_charts.id',
        'gen_charts.prompt',
        'gen_charts.type',
        'gen_charts.raw_sql_statement',
        'gen_charts.function',
      )
      .leftJoin('gen_charts_users_permissions_user_links',
        function() {
          this.on('gen_charts.id', '=', 'gen_charts_users_permissions_user_links.gen_chart_id')
        })
      .where('gen_charts_users_permissions_user_links.user_id', userId)
  } catch (error) {
    handleError(error, 'findAllByUserId Service')
    throw error
  }
}

export const deleteGenChart = async (genChartId) => {
  logger.debug('deleteGenChart Service')
  let rowDeleted = null

  try {
    await dbKnex.transaction(async trx => {
      // First delete the junction table records
      await trx('gen_charts_users_permissions_user_links')
        .where({ gen_chart_id: genChartId })
        .delete()

      // Now delete the smart layout record
      rowDeleted = await trx('gen_charts')
        .where({ id: genChartId })
        .delete()
    })
  } catch (error) {
    handleError(error, 'deleteGenChart Service')
    throw error
  }

  return rowDeleted
}


export const compileRawSqlStatement = async (rawSqlStatement) => {
  logger.debug('compileRawSqlStatement')

  try {
    const result = await dbKnex.raw(rawSqlStatement)
    return result.rows
  } catch (error) {
    handleError(error, 'compileRawSqlStatement Service')
    throw error
  }
}

export const dynamicFunctionToCompiledSqlStatement = async (
  compiledSqlStatement,
  validEvalFunctionString,
) => {
  try {
    return await validEvalFunctionString(compiledSqlStatement)
  } catch (error) {
    handleError(error, 'dynamicFunctionToCompiledSqlStatement Service')
    throw error
  }
}



