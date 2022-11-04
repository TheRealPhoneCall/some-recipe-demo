import { useState, ChangeEvent } from 'react'

export default function useFormFields (initialValues: any) {
  const [state, setState] = useState(initialValues)
  type IState = typeof initialValues

  const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target
    setState((prevState: IState) => ({...prevState, [name]: value}))
  }

  const setField = (field: Partial<IState>) => {
    setState((prevState: IState) => ({...prevState, ...field}))
  }

  return { state, setField, onValueChange }
}