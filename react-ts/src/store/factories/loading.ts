import { IReducers, IActions } from "../model"

export enum ENUM {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_DATA = "SET_DATA"
}

export function makeLoadingReducers (injector: IReducers) {
  const { state, action } = injector
  const { payload } = action;
  type IState = typeof state;

  return {
    [ENUM.SET_LOADING]: 
      () => ({...state, loading: payload.loading } as IState),
    [ENUM.SET_ERROR]: 
      () => ({...state, error: payload.error } as IState),
    [ENUM.SET_DATA]: 
      () => ({...state, data: payload.data } as IState)
  }
}

export function makeLoadingActions (injector: IActions) {

  const { dispatch } = injector

  const setLoading = (loading: boolean) => {
    dispatch({ type: ENUM.SET_LOADING, payload: { loading } })
  }

  const setError = (error: any) => {
    dispatch({ type: ENUM.SET_ERROR, payload: { error } })
  }

  const setData = (data: any) => {
    dispatch({ type: ENUM.SET_DATA, payload: { data } })
  }

  return { setLoading, setError, setData }
}