// Service.js
import logger from '../../lib/logger.js'
import { dbKnex } from '../../lib/dbConnection.js'
import { handleError } from '../../utils/errorHandler.js'

export const createGenChart = async (genChartLogRecord, rawSqlStatement) => {
  logger.debug('createGenChart Service')
  const { prompt, type, userId } = genChartLogRecord

  let newGenChart = null
  const timestamp = new Date() // Current timestamp
  // Start a transaction
  await dbKnex.transaction(async trx => {
    try {
      // Insert the new smart layout record
      [newGenChart] = await trx('gen_charts').insert({
        prompt,
        type,
        raw_sql_statement: rawSqlStatement,
        created_at: timestamp,
        updated_at: timestamp,
        created_by_id: userId,
        updated_by_id: userId,
      }).returning('*')

      // Calculate the next smart_layout_order
      const maxOrderResult = await trx('gen_charts_users_permissions_user_links')
        .where('user_id', userId)
        .max('gen_chart_order as maxOrder')
        .first()

      const nextOrder = maxOrderResult.maxOrder !== null ? maxOrderResult.maxOrder + 1 : 1

      // Insert the link with the new order
      await trx('gen_charts_users_permissions_user_links').insert({
        gen_chart_id: newGenChart.id,
        user_id: userId,
        gen_chart_order: nextOrder,
      })

      // Commit the transaction
      await trx.commit()

    } catch (error) {
      // If an error occurs, rollback the transaction
      await trx.rollback()
      handleError(error, 'createGenChartService')
      throw error // Rethrow the error for the controller to handle
    }
  })

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

export const deleteGenChart = async (genChartId) => {
  logger.debug('deleteSmartLayoutService')

  let rowDeleted = null

  await dbKnex.transaction(async trx => {
    try {
      // First delete the junction table records
      await trx('gen_charts_users_permissions_user_links')
        .where({ gen_chart_id: genChartId })
        .delete()

      // Now delete the smart layout record
      rowDeleted = await trx('gen_charts')
        .where({ id: genChartId })
        .delete()

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      handleError(error, 'deleteSmartLayout')
      throw error
    }
  })

  return rowDeleted
}
