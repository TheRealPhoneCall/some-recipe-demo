<script setup lang="ts">

import { ref, computed } from 'vue'
import { useRecipeStore } from '../store'
import { useUiStore } from 'src/stores/ui-store'
import { useUserAuthStore } from 'src/modules/auth/store'
import { IRecipe } from '../model'
import RecipeCard from './RecipeCard.vue'
import DwEmptyState from 'src/components/DwEmptyState.vue'

interface IProps {
  favorites?: boolean;
  searchText?: string;
}

const props = defineProps<IProps>()

const recipeStore = useRecipeStore()
const uiStore = useUiStore()
const authStore = useUserAuthStore()

const recipes = ref<IRecipe[]>([])
const isEmptyState = ref(false)

try {
  let payload
  if (props.favorites) {
    payload = {
      filterArgs: { usersLikedIds: authStore.authedUser._id },
      sortArgs: { createdAt: -1 }
    }
  } else {
    payload = { sortArgs: { createdAt: -1 } }
  }
  recipes.value = await recipeStore.getDocs(payload)
} catch (e) {
  console.error(e)
} finally {
  if (recipes.value.length === 0) {
    isEmptyState.value = true
  }
}

const filteredRecipes = computed(() => {
  if (props.searchText) {
    return recipes.value.filter(_recipe => {
      const nameContainsSearch = _recipe.name.includes(props.searchText as string)
      return nameContainsSearch
    })
  } else {
    return recipes.value
  }
})

</script>
<template>
  <div class="row">
    <div
      class="col-md-6 col-sm-12 col-xs-12 q-px-xs q-my-md"
      v-for="recipe in filteredRecipes"
      :key="(recipe._id as string)"
    >
      <recipe-card :recipe="recipe" />
    </div>
    <dw-empty-state
      v-if="isEmptyState && !recipes.length"
      class="col"
      :title="props.favorites ? 'No favorite recipes yet' : 'No recipes added yet'"
      :message="props.favorites
        ? 'Browse ahead, and find your favorites!'
        : 'There are no recipes added to the app yet. <br>Please add one now!'"
      :has-btn="!props.favorites"
      btn-label="Add a Recipe"
      @addRecord="uiStore.addRecipeDialog = true"
    />
  </div>
</template>
