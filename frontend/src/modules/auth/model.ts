import { IImg } from 'src/modules/images/model'

export interface IUserMin {
  _id: string;
  photo: IImg;
  username: string;
  displayName: string;
  email: string;
}

export interface IUser {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  photo: IImg;
  isVerified: boolean;
}

export const userSignupDefault = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: ''
}

export const userDefault = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  userType: 'business',
  photo: {} as IImg,
  isVerified: false
}
