import { Router } from 'express'
import touitesRouter from './touites.routes'
import usersRouter from './users.routes'
import authRouter from './auth.routes'
const router = Router()
router.get('', (_,res)=>res.send("Welcome home"))
router.use("/touites", touitesRouter)
router.use("/users", usersRouter)
router.use("/auth", authRouter)

export default router