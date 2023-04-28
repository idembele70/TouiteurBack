import { Router } from 'express'
import { addOneTouite, deleteOneTouite, getOneTouite, getAllTouites, updateOneTouite } from '../controllers/touites.controllers'
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../services/verifyToken'
const touiteRouter = Router()


touiteRouter.post("/new", [verifyTokenAndAuthorization], addOneTouite)
touiteRouter.delete("/:id", [verifyTokenAndAuthorization], deleteOneTouite)
touiteRouter.put("/:id", [verifyTokenAndAuthorization], updateOneTouite)
touiteRouter.get("/:id", [verifyTokenAndAuthorization], getOneTouite)
touiteRouter.get("/", [verifyTokenAndAuthorization], getAllTouites)

export default touiteRouter