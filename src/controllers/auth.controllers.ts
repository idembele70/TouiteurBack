import CryptoJS from "crypto-js";
import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import User, { UserProps } from '../database/models/users.model';
import { ObjectId } from "mongoose";


// Register
const register = async (req: Request<{}, {}, UserProps>, res: Response) => {
  const { PASSWORD_SECRET_KEY } = process.env
  try {
    const { password,isAdmin, ...others } = req.body
    if(!others?.email) {
      res.status(StatusCodes.BAD_REQUEST).jsonp({
        error: 'Email is required'
      })
      return 
    }
    if(!others?.username) {
      res.status(StatusCodes.BAD_REQUEST).jsonp({
        error: 'Username is required'
      })
      return 
    }
    if(!password ) {
      res.status(StatusCodes.BAD_REQUEST).jsonp({
        error: 'Password is required'
      })
      return 
    }
    const existingUser = await getUserByEmailOrUsername(others)
    if (existingUser) {
      res.status(StatusCodes.UNAUTHORIZED).json(({
        error: `A user with ${others.email === existingUser.email ? 'that email' : 'that username'} already exists`
      }))
      return
    }

    const cryptedPassword = CryptoJS.AES.encrypt(
      password, PASSWORD_SECRET_KEY
    ).toString()
    const newUser = new User({
      ...others, password: cryptedPassword
    })
    const savedUser = await newUser.save()
    if (!savedUser) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        {
          message: "Error while trying to save the user"
        }
      )
      return 
    }
    res.status(StatusCodes.OK).json({ message: "Your account is created.", username: savedUser.username })
    return
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error
    })
  }
}

// Login
type LoginCredentials = Pick<UserProps, 'username' | 'email' | 'password'>
interface LoggedUserCredentials {
  id: ObjectId,
  email: string,
  username:string,
  isAdmin:boolean,
  accessToken:string,
  exp:number
}
const login = async (req: Request<{}, {}, LoginCredentials>, res: Response) => {
  const { PASSWORD_SECRET_KEY, JWT_SECRET_KEY } = process.env
  try {
    const { password, ...emailOrUsername } = req.body
    const user = await getUserByEmailOrUsername(emailOrUsername).select("+password")
    if (!user) return res.status(StatusCodes.BAD_REQUEST).json({
      file: "auth.controllers.ts/login",
      error: `A user with that email or username doesn't exists`,
    })
    const { password: DBPassword, isAdmin, username, email } = user
    const userPassword = CryptoJS.AES.decrypt(
      DBPassword, PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8)
    if (password !== userPassword)
      return res.status(StatusCodes.FORBIDDEN).json({
        file: "auth.controllers.ts/login",
        error: `Invalid password`,
      })
    const accessToken = jwt.sign(
      { id: user._id, isAdmin }, JWT_SECRET_KEY, { expiresIn: "1d" }
    )
    const { exp } = jwt.decode(accessToken) as { exp: number }
    const loggedUserCredentials: LoggedUserCredentials = {
      id: user._id,
      email,
      username,
      isAdmin,
      accessToken,
      exp
    }
    res.status(StatusCodes.OK).json(loggedUserCredentials)
    return
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      file: "auth.controllers.ts/login",
      error
    })
    return
  }
}

const getUserByEmailOrUsername = ({ email, username }: { email?: string; username?: string }) => User.findOne(
  {
    $or: [{ email }, { username }]
  }
)

export {
  login,
  register,
  LoginCredentials,
  LoggedUserCredentials,
  getUserByEmailOrUsername
};
