import Touite, { TouiteProps } from '../database/models/touite.model';
import { Request, Response } from "express"
import User, { UserProps, createOneUser } from '../database/models/users.model';
import jwt from 'jsonwebtoken'
import CryptoJS from "crypto-js"
import { BAD_REQUEST, HTTP_FORBIDDEN, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from '../services/constants';


// Register
const register = async (req: Request<{}, {}, UserProps>, res: Response) => {
  const { PASSWORD_SECRET_KEY } = process.env
  try {
    const { password, ...others } = req.body
    const existingUser = await getUserByEmailOrUsername(others)
    if (existingUser)
      return res.status(UNAUTHORIZED).json(({
        file: "auth.controllers.ts/register",
        error: `A user with ${others.email === existingUser.email ? 'that email' : 'that username'} already exists`
      }))

    const cryptedPassword = CryptoJS.AES.encrypt(
      password, PASSWORD_SECRET_KEY
    ).toString()
    const newUser = new User({
      ...others, password: cryptedPassword
    })
    const savedUser = await newUser.save()
    return res.status(OK).json(savedUser)

  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      file: "auth.controllers.ts/register",
      error,
      message: "Catch block error"
    })
  }
}


// Login
const login = async (req: Request<{}, {}, UserProps>, res: Response) => {
  const { PASSWORD_SECRET_KEY, JWT_SECRET_KEY } = process.env

  try {
    const { password, ...others } = req.body
    const user = await getUserByEmailOrUsername(others).select("password")
    if (!user) return res.status(BAD_REQUEST).json({
      file: "auth.controllers.ts/login",
      error: `A user with that email or username doesn't exists`,
      location: "if(!user)"
    })
    const userPassword = CryptoJS.AES.decrypt(
      user.password, PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8)
    if (password !== userPassword)
      return res.status(HTTP_FORBIDDEN).json({
        file: "auth.controllers.ts/login",
        error: `Invalid password`
      })
    const accessToken = jwt.sign(
      { id: user._id }, JWT_SECRET_KEY, { expiresIn: "1d" }
    )
    const { exp } = jwt.decode(accessToken) as { exp: number }
    return res.status(OK).json({
      id: user._id,
      ...others,
      accessToken,
      exp
    })
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      file: "auth.controllers.ts/login",
      error
    })
  }
}
const getUserByEmailOrUsername = ({ email, username }: { email?: string; username?: string }) => User.findOne(
  {
    $or: [{ email }, { username }]
  }
)


export {
  login,
  register
}