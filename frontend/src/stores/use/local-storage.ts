import { ref } from 'vue'

export function useLocalStorage () {
  const storageData = ref<any>(null)
  const storageError = ref<any>(null)

  function clear () {
    localStorage.clear()
  }

  function getKey (key: string) {
    try {
      storageData.value = localStorage.getItem(key)
    } catch (e) {
      storageError.value = e
    }
    return storageData.value
  }

  function setKey (key: string, value: string) {
    try {
      localStorage.setItem(key, value)
      storageData.value = value
    } catch (e) {
      storageError.value = e
    }
    return storageData.value
  }

  return { storageData, storageError, clear, getKey, setKey }
}
