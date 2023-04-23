import Touite, { TouiteProps } from './../database/models/touite.model';
import { Request, Response } from "express"

// create a touites
const addOneTouite = async function (req: Request<{}, {}, TouiteProps>, res: Response) {
  const newTweet = new Touite(req.body)
  try {
    const savedTweet = await newTweet.save()
    res.status(200).json(savedTweet)
  } catch (error) {
    return res.status(500).json({
      file: "touites.controlers.ts/addOneTouite",
      error
    })
  }
}


// get all touites
const getTouites = async function (req: Request, res: Response) {
  return res.json()
}


export {
  addOneTouite,
  getTouites
}