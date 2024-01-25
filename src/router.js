import { Router } from 'express'
import {
  createGenChartController,
  findAllByUserIdController,
  findOneGenChartController,
  deleteGenChartController,
} from './routes/genChart/controllers.js'
import {
  createGenChartLogController,
  findOneGenChartLogController,
  findAllGenChartLogController,
  deleteGenChartLogController,
} from './routes/genChartLog/controllers.js'
import { handleInputErrors } from './middlewares.js'
import { genChartLogSchema, genChartSchema, idParamSchema } from './utils/inputValidation.js'


const router = Router()

// genChart
router.post('/genChart/create',
  ...genChartSchema,
  handleInputErrors,
  createGenChartController,
)
router.get('/genChart/findAllByUserId/:id', ...idParamSchema, handleInputErrors, findAllByUserIdController)
router.get('/genChart/findOne/:id', ...idParamSchema, handleInputErrors, findOneGenChartController)
router.delete('/genChart/delete/:id', ...idParamSchema, handleInputErrors, deleteGenChartController)


// genChartLog
router.post('/genChartLog/create',
  ...genChartLogSchema,
  handleInputErrors,
  createGenChartLogController)
router.get('/genChartLog/findAll', findAllGenChartLogController)
router.get('/genChartLog/findOne/:id', ...idParamSchema, handleInputErrors, findOneGenChartLogController)
router.delete('/genChartLog/delete/:id', ...idParamSchema, handleInputErrors, deleteGenChartLogController)

export default router
