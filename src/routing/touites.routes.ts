import { Router } from 'express'
import { addOneTouite, deleteOneTouite, getOneTouite, getAllTouites, updateOneTouite } from '../controllers/touites.controllers'
const touiteRouter = Router()


touiteRouter.post("/new", addOneTouite)
touiteRouter.delete("/:id", deleteOneTouite)
touiteRouter.put("/:id", updateOneTouite)
touiteRouter.get("/:id", getOneTouite)
touiteRouter.get("/", getAllTouites)

export default touiteRouter