import { Router } from 'express'
import { addOneTouite, deleteAllTouites, deleteOneTouite, getAllTouites, getOneTouite, updateOneTouite } from '../controllers/touites.controllers'
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../services/verifyToken'
const touiteRouter = Router()

touiteRouter.post("/new/:userId", verifyTokenAndAuthorization, addOneTouite)
touiteRouter.delete("deleteOne/:id/:userId", verifyTokenAndAuthorization, deleteOneTouite)
touiteRouter.put("/updateOne/:id/:userId", verifyTokenAndAuthorization, updateOneTouite)
touiteRouter.get("/findOne/:id/:userId", verifyTokenAndAuthorization, getOneTouite)
touiteRouter.get("/findAll/:userId", verifyTokenAndAuthorization, getAllTouites)
touiteRouter.delete("/deleteAll/:userId", verifyTokenAndAdmin, deleteAllTouites)

export default touiteRouter