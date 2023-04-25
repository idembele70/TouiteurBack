import { Schema, model } from 'mongoose'


interface UserProps {
  username: string,
  email: string;
  password: string;
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
  password: {
    type: String,
    required: true,
    select: false
  },
})

const User = model("User", UserSchema)

// User Functions

const getUsers = () => User.find()


const getOneUserById = (id: string) => User.findById(id)
const createOneUser = (values: UserProps) => new User(values)
  .save().then(
    (user) => user.toObject()
  )
const deleteUser = (id: string) => User.findByIdAndDelete(id)
const updateUser = (id: string, values: UserProps) =>
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
  UserProps,
  getUsers,
  getOneUserById,
  createOneUser,
  deleteUser,
  updateUser,
}