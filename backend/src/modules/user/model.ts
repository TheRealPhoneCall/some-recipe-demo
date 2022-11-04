import mongoose, { Schema } from 'mongoose'
import { IImg } from '../files/model'

export interface IUserMin {
  _id: string;
  photo: IImg;
  username: string;
  displayName: string;
  email: string;
}

export interface IUser extends Document {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  photo?: IImg;
  isVerified: boolean;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    userType: { type: String, required: true },
    photo: { type: Object, required: false },
    isVerified: { type: Boolean, required: false }
  },
  { timestamps: true }
)

export default mongoose.model<IUser>('User', UserSchema)