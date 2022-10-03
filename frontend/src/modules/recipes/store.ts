import { computed, toRef, Ref } from 'vue'
import { defineStore } from 'pinia'
import { IRecipe, recipeDefault } from './model'
import { IImg } from '../images/model'
import { useMongoDb } from 'src/stores/use/mongo-db'
import { useUserAuthStore } from '../auth/store'

export const useRecipeStore = defineStore('recipe', () => {
  const typeInjector = {
    docSample: recipeDefault() as IRecipe,
    docDefault: recipeDefault as () => IRecipe
  }
  const mongoStore = useMongoDb(typeInjector)
  const authStore = useUserAuthStore()

  mongoStore.baseUrl.value = 'http://localhost:9090/recipes'
  mongoStore.naming.value = {
    docName: 'recipe',
    colName: 'recipes'
  }

  const recipe: Ref<IRecipe> = toRef(mongoStore, 'doc')
  const recipes: Ref<IRecipe[]> = toRef(mongoStore, 'docs')

  const recipePhotos = computed(() => {
    console.info(recipe)
    let photos = [] as IImg[]
    if (recipe.value.photo?._id) {
      photos = [recipe.value.photo]
    }
    if (recipe.value.photos?.length) {
      photos = [
        ...photos,
        ...recipe.value.photos.filter(t => t._id !== recipe.value.photo?._id)
      ]
    }

    console.log('recipePhotos', photos)
    return photos
  })

  function userLikesRecipe (_recipe: IRecipe) {
    return _recipe.usersLikedIds.includes(authStore.authedUser._id)
  }

  function userIsRecipeCreator (_recipe: IRecipe) {
    return _recipe.creator._id === authStore.authedUser._id
  }

  async function toggleRecipeLike (_recipe: IRecipe) {
    let usersLiked, usersLikedIds
    if (!userLikesRecipe(_recipe)) {
      usersLiked = [..._recipe.usersLiked, authStore.userMin]
      usersLikedIds = [..._recipe.usersLikedIds, authStore.authedUser._id]
    } else {
      usersLiked = _recipe.usersLiked.filter(
        user => user._id !== authStore.authedUser._id
      )
      usersLikedIds = _recipe.usersLikedIds.filter(
        id => id !== authStore.authedUser._id
      )
    }
    await mongoStore.updateDoc({
      _id: _recipe._id,
      usersLiked,
      usersLikedIds
    })
  }

  return {
    recipes,
    recipe,
    recipePhotos,
    userLikesRecipe,
    userIsRecipeCreator,
    toggleRecipeLike,

    ...mongoStore
  }
})
