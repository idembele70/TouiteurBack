import express from 'express'
import router from './routing'
import 'dotenv/config'
import "./database"
import cors from "cors"
const { PORT } = process.env
const app = express()
// enable Json on request body
app.use(express.json())
// Router index connect to app
app.use(router)
// Enable cors
app.use(cors())

app.listen(PORT || 5000, () => {
  console.log("Backend server is running! on port: %d", PORT || 5000)
})