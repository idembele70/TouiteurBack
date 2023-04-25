import { Router } from 'express'
import { getAllUsers } from '../controllers/users.controllers'

const router = Router()

router.get("/", [], getAllUsers)
// Add a user

export default router