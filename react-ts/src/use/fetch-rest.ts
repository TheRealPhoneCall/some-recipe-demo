import { 
  useState, useEffect, 
  Dispatch, SetStateAction } from 'react'
import axios from 'axios'
import useLocalStorage from './local-storage'

function useFetchRest () {
  type TToken = [string, Dispatch<SetStateAction<string>>]
  const [token, setToken]: TToken = useLocalStorage('token', null)

  type TData = [any, Dispatch<SetStateAction<any>>]
  const [data, setData]: TData = useState(null)

  type TLoading = [boolean, Dispatch<SetStateAction<boolean>>]
  const [loading, setLoading]: TLoading = useState(false)

  type TError = [any, Dispatch<SetStateAction<any>>]
  const [error, setError]: TError = useState(null)

  useEffect(() => {
    if (data && data.token) {
      setToken(data.token)
    }
  }, [data, token, setToken])

  useEffect(() => {
    console.log('data changed', data)
  }, [data])

  const runRest = async (
    method: string, 
    url: string, 
    payload?: any, 
    config?: object
  ) => {
    
    let moreConfig = {}
    if (token) {
      moreConfig = {
        ...config,
        headers: { Authorization: `Bearer ${token}` }
      }
    } else {
      moreConfig = config as object
    }

    const axiosConfig = {
      url,
      method,
      data: payload,
      ...(moreConfig && moreConfig)
    }

    let result: any
    try {
      setLoading(() => true)
      result = await axios(axiosConfig)
      setData(() => result?.data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(() => false)
    }

    return result
  }

  return { loading, error, data, token, runRest }
}

export default useFetchRest