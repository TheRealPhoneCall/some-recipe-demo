import { IUser } from "../../modules/auth/model"
import { IActions, IReducers } from "../model"

export enum ENUM {
  SET_TOKEN = "SET_TOKEN",
  SET_AUTHED_USER = "SET_AUTHED_USER",
  SET_IS_AUTHED = "SET_IS_AUTHED"
}

export function makeAuthReducers (injector: IReducers) {
  const { state, action } = injector
  const { payload } = action;
  type IState = typeof state;

  return {
    [ENUM.SET_TOKEN]: (): IState => ({...state, token: payload.token }),
    [ENUM.SET_AUTHED_USER]: () => ({...state, authedUser: payload.authedUser } as IState),
    [ENUM.SET_IS_AUTHED]: () => ({...state, isAuthed: payload.isAuthed } as IState)
  }
}

export function makeAuthActions (injector: IActions) {

  const { dispatch } = injector

  const setToken = (token: string) => {
    console.log(ENUM.SET_TOKEN, { token })
    dispatch({ type: ENUM.SET_TOKEN, payload: { token } })
  }

  const setAuthedUser = (authedUser: IUser | null) => {
    console.log(ENUM.SET_AUTHED_USER, { authedUser })
    dispatch({ type: ENUM.SET_AUTHED_USER, payload: { authedUser } })
  }

  const setIsAuthed = (isAuthed: boolean) => {
    console.log(ENUM.SET_TOKEN, { isAuthed })
    dispatch({ type: ENUM.SET_AUTHED_USER, payload: { isAuthed } })
  }

  return { setToken, setAuthedUser, setIsAuthed }
}