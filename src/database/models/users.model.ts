import { Document } from 'mongoose';
import { Schema, model } from 'mongoose'


interface UserProps extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
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
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  }
}, { timestamps: true })

const User = model<UserProps>("User", UserSchema)

export default User

export {
  UserProps,
}