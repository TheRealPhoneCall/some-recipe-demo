import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    addRecipeDialog: false,
    recipeDialog: false,

    editProfileDialog: false,
    businessAccountDialog: false,

    navFooterShow: true,
    msgBottomStyle: 'auto'
  })
})
