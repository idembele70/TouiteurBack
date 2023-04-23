import { Router } from 'express'
import touiteRouter from './touites.routes'
const router = Router()

router.use("/touites", touiteRouter)

export default router