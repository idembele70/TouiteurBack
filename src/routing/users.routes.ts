import { Router } from 'express'
import { deleteOneUser, getAllUsers, getOneUser, updateAllUsers, updateOneUser } from '../controllers/users.controllers'
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middlewares/verifyToken'

const router = Router()

// Admin Routes
router.get("/", [verifyTokenAndAdmin], getAllUsers)
router.put("/", [verifyTokenAndAdmin], updateAllUsers)
// Users Routes
router.get("/:id", [verifyTokenAndAuthorization], getOneUser)
router.put("/:id", [verifyTokenAndAuthorization], updateOneUser)
router.delete("/delete", [verifyTokenAndAdmin], deleteOneUser)
// Add a user

export default router