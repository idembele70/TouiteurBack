import { Router } from 'express'
import touitesRouter from './touites.routes'
import usersRouter from './users.routes'
const router = Router()

router.use("/touites", touitesRouter)
router.use("/user", usersRouter)

export default router