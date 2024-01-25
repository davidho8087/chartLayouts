import { Router } from 'express'
import {
  createGenChartController,
  deleteGenChartController,
  findOneGenChartController,
} from './routes/genChart/controllers.js'
import {
  createGenChartLogController,
  deleteGenChartLogController, findAllGenChartLogController,
  findOneGenChartLogController,
} from './routes/genChartLog/controllers.js'
import { handleInputErrors } from './middlewares.js'
import { genChartLogSchema, genChartSchema, idParamSchema } from './utils/inputValidation.js'


const router = Router()

// Smart Layout
router.post('/genChart/create',
  ...genChartSchema,
  handleInputErrors,
  createGenChartController,
)
router.get('/genChart/findOne/:id', ...idParamSchema, handleInputErrors, findOneGenChartController)
router.delete('/genChart/delete/:id', ...idParamSchema, handleInputErrors, deleteGenChartController)


// Smart Layout Log
router.post('/genChartLog/create',
  ...genChartLogSchema,
  handleInputErrors,
  createGenChartLogController)
router.get('/genChartLog/findAll', findAllGenChartLogController)
router.get('/genChartLog/findOne/:id', ...idParamSchema, handleInputErrors, findOneGenChartLogController)
router.delete('/genChartLog/delete/:id', ...idParamSchema, handleInputErrors, deleteGenChartLogController)

export default router
