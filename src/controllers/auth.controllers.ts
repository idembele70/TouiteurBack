import CryptoJS from "crypto-js";
import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongoose";
import User from '../database/models/users.model';


// Register
interface RegisterProps {
    username: string;
    email: string;
    password: string;
}
const register = async (req: Request, res: Response) => {
  const { PASSWORD_SECRET_KEY } = process.env
  const { password, ...others } = req.body as RegisterProps
  try {
    if(Object.keys(req.body).length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Email, username & password are required'
      })
      return 
    }
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error
    })
    return 
  }
}

// Login
interface LoginProps {
  username?: string;
  email?: string;
  password: string;
}
interface LoggedUserProps {
  id: ObjectId,
  email: string,
  username:string,
  isAdmin:boolean,
  accessToken:string,
  exp:number
}
const login = async (req: Request, res: Response) => {
  const { PASSWORD_SECRET_KEY, JWT_SECRET_KEY } = process.env
  const { password, ...emailOrUsername } = req.body as LoginProps
  try {
    if(Object.keys(req.body).length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Email or username with password are required'
      })
      return 
    }
    if( !emailOrUsername?.email && !emailOrUsername?.username) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Email or username is required'
      })
      return 
    }
    if( !password ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Password is required'
      })
      return 
    }
    const user = await getUserByEmailOrUsername(emailOrUsername).select("+password")
    if(!user) {
      if(emailOrUsername?.email)
        res.status(StatusCodes.BAD_REQUEST).json({
          error: 'A user with that email doesn\'t exists',
        })
    
      if(emailOrUsername?.username)
        res.status(StatusCodes.BAD_REQUEST).json({
          error: 'A user with that username doesn\'t exists',
        })
        return
    }
    const { password: DBPassword, isAdmin, username, email } = user
    const userPassword = CryptoJS.AES.decrypt(
      DBPassword, PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8)
    if (password !== userPassword) {
     res.status(StatusCodes.FORBIDDEN).json({
        error: 'Invalid password',
      })
     return
    }
    const accessToken = jwt.sign(
      { id: user._id, isAdmin }, JWT_SECRET_KEY, { expiresIn: "1d" }
    )
    const { exp } = jwt.decode(accessToken) as { exp: number }
    const LoggedUserCredentials: LoggedUserProps = {
      id: user._id,
      email,
      username,
      isAdmin,
      accessToken,
      exp
    }
    res.status(StatusCodes.OK).json(LoggedUserCredentials)
    return
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
  getUserByEmailOrUsername,
  LoggedUserProps,
  login,
  LoginProps,
  register,
  RegisterProps
};
