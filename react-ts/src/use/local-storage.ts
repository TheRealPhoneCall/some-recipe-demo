import { 
  useState, useEffect, 
  Dispatch, SetStateAction } from 'react'

function getFromLocalStorage (key: string, initialValue: any) {
  if (typeof window !== 'undefined') {
    const value = JSON.parse(localStorage.getItem(key) as any)
    return value || initialValue
  }

  return initialValue
}

function saveToLocalStorage (key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

export default function useLocalStorage (key: string, initialValue: any | null) {
  type TValue = typeof initialValue
  type TSetValue = Dispatch<SetStateAction<TValue>>
  const [value, setValue]: [TValue, TSetValue] = useState(() => {
    return getFromLocalStorage(key, initialValue)
  })

  useEffect(() => {
    saveToLocalStorage(key, value)
  }, [key, value])

  return [value, setValue] as [TValue, TSetValue]
}