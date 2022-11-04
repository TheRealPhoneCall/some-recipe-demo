import { 
  createContext, useReducer, useContext, useEffect,
  FC, ReactNode
} from "react";
import useFetchRest from "../../use/fetch-rest";
import { makeLoadingActions } from "../../store/factories/loading";
import { makeAuthActions } from "../../store/factories/auth";
import { ENUM, IState, initialState } from './model'

const UserContext = createContext(initialState)

function userReducer (
  state: IState, 
  action: { type: ENUM, payload: any}
) {
  const { type, payload } = action;

  const reducerActions: any = {
    [ENUM.SET_LOADING]:  
      () => ({...state, loading: payload.loading } as IState),
    [ENUM.SET_ERROR]: 
      () => ({...state, error: payload.error } as IState),
    [ENUM.SET_DATA]: 
      () => ({...state, data: payload.data } as IState),
    [ENUM.SET_TOKEN]: 
      () => ({...state, token: payload.token } as IState),
    [ENUM.SET_AUTHED_USER]: 
      () => ({...state, authedUser: payload.authedUser } as IState),
    [ENUM.SET_IS_AUTHED]: 
      () => ({...state, isAuthed: payload.isAuthed } as IState)
  }

  if (Object.values(payload).includes(type)) {
    throw new Error(`No case for type ${type} found in userReducer`)
  }

  // if no error, return the reducer action
  return reducerActions[type]()
}

export const UserProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { loading, data, error, runRest } = useFetchRest();

  const { 
    setLoading, 
    setError,
    setData
  } = makeLoadingActions({ dispatch })

  const { 
    setAuthedUser, 
    setIsAuthed,
    setToken 
  } = makeAuthActions({ dispatch })

  useEffect(() => {
    setLoading(loading);
  }, [loading])

  useEffect(() => {
    setError(error);
  }, [error])

  useEffect(() => {
    console.log('updating data', data)
    setData(data);
  }, [data])

  const loginUser: IState["loginUser"] = async (payload) => {
    const result = await runRest('post', 'http://localhost:9090/auth/sign-in', payload)
    const authedUser = result?.data?.user || null
    const token = result?.data?.token || ''
    if (authedUser) {
      setToken(token)
      setAuthedUser(authedUser)
      setIsAuthed(true)
    }
  }

  const logoutUser: IState["logoutUser"] = async () => {
    const result = await runRest('post', 'http://localhost/auth/sign-out')
    if (result.data) {
      setToken('')
      setAuthedUser(null)
      setIsAuthed(false)
    }
  }

  const signupUser: IState["loginUser"] = async (payload) => {
    const result = await runRest('post', 'http://localhost:9090/auth/sign-up', payload)
    console.log('signupUser', result)
    const authedUser = result?.data?.user || null
    const token = result?.data?.token || ''
    if (authedUser) {
      setToken(token)
      setAuthedUser(authedUser)
      setIsAuthed(true)
    }
  }

  const value: IState = {
    ...state,
    loginUser,
    logoutUser,
    signupUser
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useUserStore = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserStore must be used within UserContext");
  }

  return context;
}

export default useUserStore;