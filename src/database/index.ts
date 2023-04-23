import mongoose from 'mongoose'

const { MONGO_URL } = process.env
mongoose.connect(
  MONGO_URL
).then(
  () => console.log("Connected to db")
)
  .catch(
    () => console.log("Something went wrong cannot connect to DB")
  )

