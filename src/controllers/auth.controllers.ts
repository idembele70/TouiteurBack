import Touite, { TouiteProps } from '../database/models/touite.model';
import { Request, Response } from "express"
import { UserProps, UserReqBody, createOneUser, getUserByEmailOrUsername } from '../database/models/users.model';
import { authentification, random } from '../services';
import crypto from "crypto"
import { BAD_REQUEST, HTTP_FORBIDDEN, INTERNAL_SERVER_ERROR, OK } from '../services/constants';

// Login
const login = async (req: Request<{}, {}, UserReqBody>, res: Response) => {
  try {
    const { password, email } = req.body
    if (!email || !password) {
      return res.status(BAD_REQUEST).json({
        error: "Please provide values for all required fields: email and password",
      })
    }
    const user = await getUserByEmailOrUsername({ email })
      .select("+authentification.salt +authentification.password")
    if (!user) {
      return res.status(BAD_REQUEST).json({
        file: "auth.controllers.ts/login",
        error: `A user with that email doesn't exists`
      })
    }
    const expectedPasswordHash = authentification(user.authentification.salt, password)
    if (user.authentification.password !== expectedPasswordHash) {
      return res.status(HTTP_FORBIDDEN).json({
        file: "auth.controllers.ts/login",
        error: `Invalid email or password`
      })
    }
    const salt = random()
    user.authentification.sessionToken = authentification(salt, user._id.toString())
    await user.save();
    const { COOKIE_SECRET_KEY, COOKIE_DOMAIN } = process.env
    res.cookie(COOKIE_SECRET_KEY, user.authentification.sessionToken, {
      domain: COOKIE_DOMAIN,
      path: "/"
    })
    return res.status(OK).json(user)
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      file: "auth.controllers.ts/login",
      error
    })
  }
}

// Register
const register = async (req: Request<{}, {}, UserReqBody>, res: Response) => {

  try {
    const { email, password, username } = req.body
    if (!email || !password || !username) {
      return res.status(BAD_REQUEST).json({
        file: "auth.controllers.ts/register",
        error: "Please provide values for all required fields: email, password, and username",
      })
    }
    const existingUser = await getUserByEmailOrUsername({ email, username })
    if (existingUser) {
      return res.status(BAD_REQUEST).json({
        file: "auth.controllers.ts/register",
        error: `A user with ${email ? 'that email' : 'that username'} already exists`
      })
    }
    const salt = random()
    const registeredUser = await createOneUser({
      email,
      username,
      authentification: {
        salt,
        password: authentification(salt, password)
      }
    })
    return res.status(OK).json(registeredUser)
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      file: "auth.controllers.ts/register",
      error
    })
  }
}

export {
  login,
  register
}