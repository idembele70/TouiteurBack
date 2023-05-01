import { StatusCodes } from 'http-status-codes';
import Touite, { TouiteProps } from './../database/models/touite.model';
import { Request, Response } from "express"

// Create a touite
const addOneTouite = async function (req: Request<TouiteReqParams, {}, TouiteProps>, res: Response) {
  try {
    const { text } = req.body
    const newTweet = new Touite({
      author: req.params.id,
      text
    })
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
interface TouiteReqParams {
  id?: string,
  userId?: string
}
const deleteOneTouite = async function (req: Request<TouiteReqParams>, res: Response) {
  const touiteId = req.params.id
  try {
    const deletedTouite = await Touite.findByIdAndDelete(touiteId)
    if (!deletedTouite)
      return res.status(StatusCodes.NOT_FOUND).json("Touite not found")
    return res.status(StatusCodes.OK).json("Touite deleted!!")
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      file: "touites.controllers.ts/deleteOneTouite",
      error,
      message: "Failed to delete touite"
    })
  }
}
// Update a touite
const updateOneTouite = async function (req: Request<TouiteReqParams, {}, TouiteProps>, res: Response) {
  const touiteId = req.params.id;
  const { text } = req.body
  try {
    const touiteUpdated = await Touite.findByIdAndUpdate(touiteId,
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
const getOneTouite = async function (req: Request<TouiteReqParams>, res: Response) {
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
// Delete all touites
const deleteAllTouites = async function (req: Request, res: Response) {
  try {
    await Touite.deleteMany({})
    return res.status(StatusCodes.OK).json("Every touite is deleted")
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      {
        error,
        file: "touites.controllers.ts/deleteAllTouites",
        message: "Error deleting users"
      }
    )
  }
}

export {
  addOneTouite,
  deleteOneTouite,
  updateOneTouite,
  getOneTouite,
  getAllTouites,
  deleteAllTouites,
  TouiteReqParams
}