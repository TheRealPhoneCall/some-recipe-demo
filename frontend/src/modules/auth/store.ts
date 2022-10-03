import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { IUser, IUserMin } from './model'
import { useRest } from 'src/stores/use/rest'

export const useUserAuthStore = defineStore('userAuth', () => {
  const authedUser = ref<IUser>({} as IUser)
  const baseUrl = 'http://localhost:9090/auth'

  const { loading, error, data, token, runRest } = useRest()

  const userType = computed(() => {
    return authedUser.value?.userType || ''
  })

  const displayName = computed<string>(() => {
    return `${authedUser.value.firstName} ${authedUser.value.lastName}`
  })

  const isAuthed = computed<boolean>(() => {
    return Object.keys(authedUser.value).length !== 0 && token.value !== null
  })

  const userMin = computed<IUserMin>(() => {
    if (isAuthed.value) {
      return {
        _id: authedUser.value._id,
        username: authedUser.value.username,
        displayName: displayName.value,
        email: authedUser.value.email,
        photo: authedUser.value.photo
      }
    }
    return {} as IUserMin
  })

  async function checkAuth () {
    console.log('pinia action checkAuth')
    await runRest('get', `${baseUrl}/validate`)
    authedUser.value = data.value?.user || {}
    token.value = data.value?.token || null
  }

  async function signUp (payload: any) {
    console.log('pinia action signup')
    await runRest('post', `${baseUrl}/sign-up`, payload)
    authedUser.value = data.value?.user || authedUser.value
    token.value = data.value?.token || null
  }

  async function signIn (payload: any) {
    console.log('pinia action signup')
    await runRest('post', `${baseUrl}/sign-in`, payload)
    authedUser.value = data.value?.user || authedUser.value
    token.value = data.value?.token || null
  }

  async function updateAccount (payload: any) {
    console.log('pinia action signup')
    await runRest('post', `${baseUrl}/update-account`, payload)
    authedUser.value = data.value?.user || authedUser.value
    token.value = data.value?.token || null
  }

  function signOut () {
    authedUser.value = {} as IUser
    token.value = null
  }

  return {
    authedUser,
    token,
    isAuthed,
    userType,
    loading,
    error,
    displayName,
    userMin,
    checkAuth,
    updateAccount,
    signUp,
    signIn,
    signOut
  }
})
