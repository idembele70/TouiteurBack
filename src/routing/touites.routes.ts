import { Router } from 'express'
import { addOneTouite, getTouites } from '../controllers/touites.controllers'
const touiteRouter = Router()


touiteRouter.post("/new", addOneTouite)
touiteRouter.get("/", getTouites)

export default touiteRouter