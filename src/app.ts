import { resolve } from 'path'
import dotenvFlow from 'dotenv-flow'
// dotenvflow Config
dotenvFlow.config({
  path: resolve('env')
}) 
import compression from 'compression'
import cookieparser from 'cookie-parser'
import cors from "cors"
import express from 'express'
import "./database"
import router from './routing'
const { PORT } = process.env

const app = express()
// enable Json on request body
app.use(express.json())
  // Connect router
  .use(router)
  // Enable cors
  .use(cors({
    credentials: true
  }))
  // use compression
  .use(
    compression()
  )
  // cookie parser
  .use(
    cookieparser()
  )


  app.listen(PORT || 5000, () => {
  console.log("Backend server is running! on port: %d", PORT || 5000)
})