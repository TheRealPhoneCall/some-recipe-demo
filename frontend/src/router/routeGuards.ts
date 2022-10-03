import { useUserAuthStore } from 'src/modules/auth/store'

export const requireAuth = async (to: any, from: any, next: any) => {
  const authStore = useUserAuthStore()

  if (authStore.isAuthed) {
    console.log('logged in, routing to: ' + to.path)
    next()
  } else {
    console.log('logged out, validating token...')
    await authStore.checkAuth()
    if (authStore.isAuthed) {
      console.log('token validated, routing to: ' + to.path)
      next()
    } else {
      console.log('token no longer valid. routing to sign in page.')
      next('/auth/sign-in')
    }
  }
}
