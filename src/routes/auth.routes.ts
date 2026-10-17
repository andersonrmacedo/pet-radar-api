import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router     = Router()
const controller = new AuthController()

router.post('/auth/register', (req, res) => controller.register(req, res))
router.post('/auth/login',    (req, res) => controller.login(req, res))
router.post('/auth/logout',   (req, res) => controller.logout(req, res))
router.get('/auth/me',        authMiddleware, (req, res) => controller.me(req, res))

export default router