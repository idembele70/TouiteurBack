import { StatusCodes } from 'http-status-codes';
import Touite, { TouiteProps } from './../database/models/touite.model';
import { Request, Response } from "express"

// Create a touite
const addOneTouite = async function (req: Request<{}, {}, TouiteProps>, res: Response) {
  const newTweet = new Touite(req.body)
  try {
    const savedTweet = await newTweet.save()
    res.status(StatusCodes.OK).json(savedTweet)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      file: "touites.controllers.ts/addOneTouite",
      error
    })
  }
}

// Delete a touite
export interface ReqParams {
  id?: string
}
const deleteOneTouite = async function (req: Request<ReqParams>, res: Response) {
  const { id } = req.params
  try {
    await Touite.findByIdAndDelete(id)
    return res.status(StatusCodes.OK).json("Touite deleted!!")
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      file: "touites.controllers.ts/deleteOneTouite",
      error
    })
  }
}
// Update a touite
const updateOneTouite = async function (req: Request<ReqParams, {}, TouiteProps>, res: Response) {
  const { id } = req.params;
  const { text } = req.body
  try {
    const touiteUpdated = await Touite.findByIdAndUpdate(id,
      {
        $set: { text }
      }, { new: true, })
    return res.status(StatusCodes.OK).json(touiteUpdated)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      file: "touites.controllers.ts/updateOneTouite",
      error
    })
  }
}


// Get one touite
const getOneTouite = async function (req: Request<ReqParams>, res: Response) {
  const { id } = req.params
  try {
    const touite = await Touite.findById(id)
    return res.status(StatusCodes.OK).json(touite)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      file: "touites.controllers.ts/getOneTouite",
      error
    })
  }
}
// Get all touites
const getAllTouites = async function (req: Request, res: Response) {
  try {
    const touites = await Touite.find({})
    return res.status(StatusCodes.OK).json(touites)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      file: "touites.controllers.ts/getAllTouites",
      error
    })
  }
}


export {
  addOneTouite,
  deleteOneTouite,
  updateOneTouite,
  getOneTouite,
  getAllTouites
}