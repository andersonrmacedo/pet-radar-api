import { Router } from 'express'
import { ReportController } from '../controllers/report.controller'

const router = Router()
const controller = new ReportController()

router.post('/reports', (req, res) => controller.create(req, res))
router.get('/reports', (req, res) => controller.findAll(req, res))
router.get('/reports/:id', (req, res) => controller.findById(req, res))

export default router