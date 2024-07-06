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
    const { password, isAdmin, ...others } = req.body
    if(!others?.email) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Email is required'
      })
      return
    }
    if(!others?.username) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Username is required'
      })
      return
    }
    if(!password ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Password is required'
      })
      return
    }
    const existingUser = await getUser(others)
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error
    })
    return
  }
}

// Login
interface LoginCredentials {
  username: string;
  email: string;
  password: string;
}
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
    if(!emailOrUsername?.email && !emailOrUsername?.username) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: "An email or username is required"
      })
      return
    }
    if(!password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: "An password is required"
      })
      return
    }
    // let user:any
    const existingUser = await getUser(emailOrUsername)
    if (!existingUser){
      res.status(StatusCodes.BAD_REQUEST).json({
       error: 'A user with that email or username doesn\'t exists',
     })
     return
    } 
    const user = await getUser(emailOrUsername).select('+password') as UserProps
    const { password: cryptedPassword, isAdmin, username, email } = user
    const decryptedPassword = CryptoJS.AES.decrypt(
      cryptedPassword, PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8)
    if (password !== decryptedPassword)
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Invalid password',
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
      error
    })
    return
  }
}
interface GetUserParams {
   email?: string;
   username?: string;
}
const getUser = ({ email, username }: GetUserParams) => User.findOne(
  {
    $or: [{ email }, { username }]
  }
)

export {
  login,
  register,
  LoginCredentials,
  LoggedUserCredentials,
  getUser
};
