import { useState, ChangeEvent } from 'react'

export default function useFormField (initialValue: any) {
  const [value, setValue] = useState(initialValue)

  const onValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return [ value, onValueChange ]
}