import logger from '../../lib/logger.js'
import { dbKnex } from '../../lib/dbConnection.js'


export const createSmartLayout = async ({ prompt, type }) => {
  logger.debug('createSmartLayout Service');
  try {
    const timestamp = new Date(); // Current timestamp

    // Insert the new smart layout record
    const [newSmartLayout] = await dbKnex('smart_layouts').insert({
      prompt: prompt,
      type: type,

      created_at: timestamp,
      updated_at: timestamp,
    }).returning('*'); // Returns all columns of the inserted row

    return newSmartLayout;
  } catch (error) {
    logger.error('Error in createSmartLayout:', error);
    throw error; // Rethrow the error for the controller to handle
  }
};