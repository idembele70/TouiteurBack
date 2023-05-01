import { Router } from 'express'
import { addOneTouite, deleteAllTouites, deleteOneTouite, getAllTouites, getOneTouite, updateOneTouite } from '../controllers/touites.controllers'
import { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAndTouiteAuthorization } from '../middlewares/verifyToken'
const touiteRouter = Router()

touiteRouter.post("/new/:id", verifyTokenAndAuthorization, addOneTouite)
touiteRouter.delete("/:id", verifyTokenAndTouiteAuthorization, deleteOneTouite)
touiteRouter.put("/:id", verifyTokenAndTouiteAuthorization, updateOneTouite)
touiteRouter.get("/:id", verifyTokenAndTouiteAuthorization, getOneTouite)
touiteRouter.get("/", verifyTokenAndTouiteAuthorization, getAllTouites)
touiteRouter.delete("/deleteAll/:userId", verifyTokenAndAdmin, deleteAllTouites)

export default touiteRouter