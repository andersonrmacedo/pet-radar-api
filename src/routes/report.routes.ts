import { Router } from 'express'
import { ReportController } from '../controllers/report.controller'
import { upload } from '../config/multer'

const router     = Router()
const controller = new ReportController()

router.post('/reports', upload.single('photo'), (req, res) => controller.create(req, res))
router.get('/reports',                          (req, res) => controller.findAll(req, res))
router.get('/reports/:id',                      (req, res) => controller.findById(req, res))

export default router