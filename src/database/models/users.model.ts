import { Schema, model } from 'mongoose'


export interface UserProps {
  username: string,
  email: string;
  authentification: {
    password: string;
    salt: string;
    sessionToken?: string
  }
}

const UserSchema = new Schema<UserProps>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  authentification: {
    password: {
      type: String,
      required: true,
      select: false
    },
    salt: {
      type: String,
      select: false
    },
    sessionToken: {
      type: String,
      select: false
    },
  }
})

const User = model("User", UserSchema)

// user CRUD

const getUserByEmailOrUsername = ({ email, username }: { email?: string; username?: string }) => User.findOne(
  {
    $or: [{ email }, { username }]
  }
)
const getUserBySessionToken = (sessionToken: string) =>
  User.findOne({
    "authentification.sessionToken": sessionToken
  })
const getOneUserById = (id: string) => User.findById(id)
interface UserReqBody {
  username: string,
  email: string;
  password: string;
}
const createOneUser = (values: UserProps) => new User(values)
  .save().then(
    user => user.toObject()
  )
const deleteUser = (id: string) => User.findByIdAndDelete(id)
const updateUser = (id: string, values: UserReqBody) =>
  User.findByIdAndUpdate(
    id, {
    $set: { ...values }
  },
    {
      new: true
    }
  )

export default User

export {
  UserReqBody,
  getUserByEmailOrUsername,
  getUserBySessionToken,
  getOneUserById,
  createOneUser,
  deleteUser,
  updateUser,
}