import { Router } from 'express'
import { createSmartLayout } from './constroller/smartLayout.controller.js'

const router = Router()

router.post('/smartLayout/create', createSmartLayout)

export default router
