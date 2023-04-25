import express from 'express'
import router from './routing'
import 'dotenv/config'
import "./database"
import cors from "cors"
import cookieparser from 'cookie-parser'
import compression from 'compression'
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