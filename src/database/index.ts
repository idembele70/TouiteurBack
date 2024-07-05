import mongoose from 'mongoose'

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_OPTIONS, MONGO_APP_NAME } = process.env
  const MONGODB_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/?${MONGO_OPTIONS}&appName=${MONGO_APP_NAME}`
mongoose.connect(
  MONGODB_URL || ""
).then(
  () => console.log("Connected to db")
)
  .catch(
    () => console.log("Something went wrong cannot connect to DB")
  )

