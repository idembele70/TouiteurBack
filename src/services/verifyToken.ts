import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserJwtPayload } from '../types/express';
import { StatusCodes } from 'http-status-codes';

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
    if (user && (user?.id === req.params.userId || user?.isAdmin)) {
      return next()
    }
    return res.status(StatusCodes.FORBIDDEN).json("You are not authorized to perform this action")
  })
}

const verifyTokenAndAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log("in there")
  verifyToken(req, res, () => {
    const { user } = req
    if (user && user.isAdmin) {
      return next()
    }
    return res.status(StatusCodes.FORBIDDEN).json("You must be an admin to perform this action")
  })
}


export {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization
};

