import axios from 'axios'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export function useRest () {
  const data = ref<any>(null)
  const response = ref<any>({})
  const error = ref<object | string | null>(null)
  const loading = ref<boolean>(false)
  const token = ref(
    useLocalStorage('token', null)
  )

  const convertIfFiltered = (baseUrl: string, payload: any) => {
    let url = baseUrl
    let method = 'get'
    let params
    if (payload?.filterArgs || payload?.sortArgs) {
      url = `${baseUrl}/filtered`
      method = 'post'
    }
    if (payload?.limit) {
      params = { limit: payload.limit }
    }
    if (payload?.page) {
      params = { ...params, page: payload.page }
    }
    const config = { params }
    return { method, url, config }
  }

  const runRest = async (method: string, url: string, payload?: any, config?: object) => {
    console.log(`running rest: method - ${method} | url- ${url}`)
    console.log('payload: ', payload)
    loading.value = true
    error.value = null

    let newConfig = {}
    if (token?.value) {
      newConfig = {
        ...config,
        headers: { Authorization: `Bearer ${token.value}` }
      }
    } else {
      newConfig = config as object
    }

    const axiosConfig = {
      url,
      method,
      data: payload,
      ...(newConfig && newConfig)
    }

    console.log(axiosConfig)
    try {
      const result = await axios(axiosConfig as any)
      response.value = result
      data.value = result.data
      console.info('result', data.value)
    } catch (err) {
      error.value = err as object
    } finally {
      loading.value = false
    }
  }

  return { response, data, error, token, loading, convertIfFiltered, runRest }
}
