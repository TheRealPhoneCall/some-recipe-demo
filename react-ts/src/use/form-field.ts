import { useState, ChangeEvent } from 'react'
import debounce from 'lodash.debounce'

export default function useFormField (initialValue: any, debounceDelay?: number) {
  const [value, setValue] = useState(initialValue)

  const onValueChange = (event: ChangeEvent<HTMLInputElement>) => debounce(() => {
    setValue(event.target.value)
  }, debounceDelay || 100)

  return [ value, onValueChange ]
}