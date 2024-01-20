import { Router } from 'express'
import { createSmartLayoutController } from './routes/smartLayout/controllers.js'
const router = Router()

router.post('/smartLayout/create', createSmartLayoutController)

export default router
