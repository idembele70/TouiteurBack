import Touite, { TouiteProps } from '../database/models/touite.model';
import { Request, Response } from "express"
import User from '../database/models/users.model';
import { ReqParams } from './touites.controllers';

// Create a new User
const addOneUser = async function (req: Request<{}, {}, TouiteProps>, res: Response) {

}

// Delete a user
const deleteOneUser = async function (req: Request<ReqParams>, res: Response) {

}
// Update a user
const updateOneUser = async function (req: Request<ReqParams, {}, TouiteProps>, res: Response) {

}


// Get one user
const getOneUserByEmail = async function (req: Request<ReqParams>, res: Response) {
  const { id } = req.params
  try {
    const touite = await Touite.findById(id)
    return res.status(OK).json(touite)
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      file: "touites.controllers.ts/getOneTouite",
      error
    })
  }
}
// Get all users
const getAllUsers = async function (req: Request, res: Response) {
  try {
    const Users = await User.find({})
    return res.status(OK).json(Users)
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      file: "Users.controllers.ts/getAllUsers",
      error
    })
  }
}


export {
  addOneUser,
  deleteOneUser,
  updateOneUser,
  getOneUserByEmail,
  getAllUsers
}