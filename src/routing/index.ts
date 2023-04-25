import { Router } from 'express'
import touitesRouter from './touites.routes'
import usersRouter from './users.routes'
import authRouter from './auth.routes'
const router = Router()

router.use("/touites", touitesRouter)
router.use("/user", usersRouter)
router.use("/auth", authRouter)

export default router