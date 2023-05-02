import { Router } from 'express'
import { addOneTouite, deleteAllTouites, deleteOneTouite, getAllTouites, getOneTouite, updateOneTouite } from '../controllers/touites.controllers'
import { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAndTouiteAuthor, verifyToken } from '../middlewares/verifyToken'
const touiteRouter = Router()

touiteRouter.post("/new", verifyToken, addOneTouite)
touiteRouter.delete("/:id", verifyTokenAndTouiteAuthor, deleteOneTouite)
touiteRouter.put("/:id", verifyTokenAndTouiteAuthor, updateOneTouite)
touiteRouter.get("/:id", verifyToken, getOneTouite)
touiteRouter.get("/", verifyToken, getAllTouites)
touiteRouter.delete("/deleteAll/:userId", verifyTokenAndAdmin, deleteAllTouites)

export default touiteRouter