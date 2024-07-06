import { Request, Response } from "express";
import User, { UserProps } from '../database/models/users.model';
import { StatusCodes } from "http-status-codes";
import { LoginCredentials } from "./auth.controllers";

export interface ReqParams {
  id?: string;
}
// Get a user 
const getOneUser = async (req: Request<ReqParams>, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user)
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
        location: "Users.controllers.ts/getOneUser",
      });
    return res.status(StatusCodes.OK).json(user)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to get user",
      error,
      location: "Users.controllers.ts/getOneUser",
    })
  }
}
// Update a user
const updateOneUser = async function (req: Request<ReqParams, {}, UserProps>, res: Response) {
  try {
    const { id } = req.params
    const updatedUser = await User.findByIdAndUpdate(
      id, {
      $set: { ...req.body }
    }, {
      new: true
    }
    )
    return res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update user",
      error,
      location: "Users.controllers.ts/updateOneUser",
    })
  }
}

// Delete one user

const deleteOneUser = async function (req:Request, res: Response) {
  const {username, email} = req.body as LoginCredentials
  try {
    const deletedUser = await User.findOneAndDelete({
       $or: [{email}, {username}]
     })
     console.log(deletedUser)
     res.status(StatusCodes.OK).json(
      deletedUser
     )
     return
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error
    })
    return 
  }
}

// Update field from all users
const updateAllUsers = async function (req: Request<never, never, UserProps>, res: Response) {
  try {
    const updatedUsers = await User.updateMany(
      {}, { ...req.body }, { new: true }
    )
    return res.status(StatusCodes.OK).json(updatedUsers)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update users",
      error,
      location: "Users.controllers.ts/updateAllUser",
    })
  }
}

// Get all users
const getAllUsers = async function (req: Request, res: Response) {
  try {
    const users = await User.find()
    return res.status(StatusCodes.OK).json(users)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to retrieve users",
      error,
      location: "Users.controllers.ts/getAllUsers",
    })
  }
}

export { getOneUser, updateOneUser, deleteOneUser, updateAllUsers, getAllUsers, };

