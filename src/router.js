import { Router } from 'express'
import { createSmartLayoutController } from './routes/smartLayout/controllers.js'
import {
  createSmartLayoutLogController,
  deleteSmartLayoutLogController,
  findAllSmartLayoutLogController,
  findOneSmartLayoutLogController,
} from './routes/smartLayoutLog/controllers.js'
const router = Router()

// Smart Layout
router.post('/smartLayout/create', createSmartLayoutController)

// Smart Layout Log
router.post('/smartLayoutLog/create', createSmartLayoutLogController)
router.get('/smartLayoutLog/findAll', findAllSmartLayoutLogController);
router.get('/smartLayoutLog/find/:id', findOneSmartLayoutLogController);
router.delete('/smartLayoutLog/delete/:id', deleteSmartLayoutLogController)

export default router
