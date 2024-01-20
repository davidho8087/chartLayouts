import { Router } from 'express'
import { createSmartLayout } from './controller/smartLayout.controller.js'

const router = Router()

router.post('/smartLayout/create', createSmartLayout)

export default router
