import Touite, { TouiteProps } from '../database/models/touite.model';
import { Request, Response } from "express"
import User, { UserProps } from '../database/models/users.model';
import jwt from 'jsonwebtoken'
import CryptoJS from "crypto-js"
import { StatusCodes } from 'http-status-codes';


// Register
const register = async (req: Request<{}, {}, UserProps>, res: Response) => {
  const { PASSWORD_SECRET_KEY } = process.env
  try {
    const { password, ...others } = req.body
    const existingUser = await getUserByEmailOrUsername(others)
    if (existingUser)
      return res.status(StatusCodes.UNAUTHORIZED).json(({
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
    if (!savedUser)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        {
          file: "auth.controllers.ts/register",
          message: "Error while trying to save the user"
        }
      )
    return res.status(StatusCodes.OK).json({ message: "Your account is created.", username: savedUser.username })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
    return res.status(StatusCodes.OK).json({
      id: user._id,
      email,
      username,
      isAdmin,
      accessToken,
      exp
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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