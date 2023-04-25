import { Router } from 'express'
import { login, register } from '../controllers/auth.controllers'

const router = Router()

// Add a user
router.post("/register", register)
router.post("/login", login)
export default router