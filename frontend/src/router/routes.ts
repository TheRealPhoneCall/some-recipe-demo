import { RouteRecordRaw } from 'vue-router'
import { requireAuth } from './routeGuards'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    beforeEnter: requireAuth,
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      path: '',
      component: () => import('pages/IndexPage.vue')
    }]
  },
  {
    path: '/auth',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'sign-up',
        name: 'sign-up',
        component: () => import('src/modules/auth/components/SignUp.vue')
      },
      {
        path: 'sign-in',
        name: 'sign-in',
        component: () => import('src/modules/auth/components/SignIn.vue')
      }
    ]
  },
  {
    path: '/account',
    beforeEnter: requireAuth,
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      path: '',
      component: () => import('src/modules/auth/components/AccountPage.vue')
    }]
  },
  {
    path: '/recipes',
    beforeEnter: requireAuth,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/modules/recipes/components/RecipesPage.vue') },
      { path: 'favorites', component: () => import('src/modules/recipes/components/FavoritesPage.vue') },
      {
        path: ':id/:operation',
        name: 'recipe',
        props: true,
        component: () => import('src/modules/recipes/components/RecipeCrud.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
