import { IImg } from '../images/model'

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

export interface ISignupState {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
  isPwdConfirmed: boolean;
}

export enum ENUM {
  SET_TOKEN = "SET_TOKEN",
  SET_AUTHED_USER = "SET_AUTHED_USER",
  SET_IS_AUTHED = "SET_IS_AUTHED",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_DATA = "SET_DATA"
}

export interface IState {
  loading: boolean;
  error: any;
  data: any;
  authedUser: IUser | null;
  token: string | null;
  isAuthed: boolean;
  loginUser: (payload: { 
    username: string; 
    password: string;
  }) => Promise<void>;
  logoutUser: () => Promise<void>;
  signupUser: (payload: { 
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    userType: string;
  }) => Promise<void>,
} 

export const initialState: Partial<IState> = {
  loading: false,
  error: null,
  data: null,
  authedUser: null,
  token: '',
  isAuthed: false
}

export const userSignupDefault = () => ({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: ''
})

export const userDefault = () => ({
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  userType: 'business',
  photo: {} as IImg,
  isVerified: false
}) as IUser
