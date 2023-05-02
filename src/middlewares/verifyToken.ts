import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserJwtPayload } from '../types/express';
import { StatusCodes } from 'http-status-codes';
import Touite from '../database/models/touite.model';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1]
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(StatusCodes.FORBIDDEN).json("Invalid token")
      }
      else {
        req.user = user as UserJwtPayload
        return next()
      }
    })
  } else
    return res.status(StatusCodes.UNAUTHORIZED).json("Authenticated required")

}


const verifyTokenAndAuthorization = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    const { user } = req
    if (user && (user.id === req.params.id || user?.isAdmin)) {
      return next()
    }
    return res.status(StatusCodes.FORBIDDEN).json("You are not authorized to perform this action")
  })
}

const verifyTokenAndAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    const { user } = req
    if (user && user.isAdmin) {
      return next()
    }
    return res.status(StatusCodes.FORBIDDEN).json("You must be an admin to perform this action")
  })
}
const verifyTokenAndTouiteAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const touite = await Touite.findById(req.params.id)
    if (!touite)
      return res.status(StatusCodes.NOT_FOUND).json({
        file: "middlewares/verifyToken/verifyTokenAndTouiteAuthor",
        error: "Tweet not found"
      })
    verifyToken(req, res, () => {
      const { user } = req
      if (user && (String(touite.author) === user.id)) {
        return next()
      }
      return res.status(StatusCodes.FORBIDDEN).json({
        file: "middlewares/verifyToken/verifyTokenAndTouiteAuthor",
        error: "You must be the author to perform this action"
      })
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      {
        file: "middlewares/verifyToken/verifyTouiteAuthor",
        error
      }
    )
  }

}


export {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
  verifyTokenAndTouiteAuthor
};

