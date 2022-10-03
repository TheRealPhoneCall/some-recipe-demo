<script setup lang="ts">

import { useLinks } from 'src/components/use/links'
import { IRecipe } from '../model'
import { useRecipeStore } from '../store'

interface IProps {
  recipe: IRecipe;
}

const props = defineProps<IProps>()

const { getUrl } = useLinks()
const recipeStore = useRecipeStore()
const rating = 4.5

</script>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>

<template>
  <q-card v-if="props.recipe" class="my-card">
    <q-img :src="getUrl(props.recipe.photo?.path as string)" />

    <q-card-section>
      <q-btn
        fab
        color="primary"
        :icon="recipeStore.userLikesRecipe(props.recipe) ? `favorite` : 'favorite_outline'"
        class="absolute"
        @click="recipeStore.toggleRecipeLike(props.recipe)"
        style="top: 0; right: 12px; transform: translateY(-50%);"
      />

      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis">
          {{ props.recipe.name }}
        </div>
      </div>

      <q-rating :modelValue="rating" :max="5" size="25px" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-subtitle1">
        By: {{ props.recipe.creator.displayName }}
      </div>
      <div class="text-caption text-grey">
        <span v-html="props.recipe.desc"></span>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn
        flat
        color="primary"
        @click="$router.push(`/recipes/${props.recipe._id}/retrieve`)"
      >
        Try this Recipe
      </q-btn>
      <q-space />
      <q-btn
        v-if="recipeStore.userIsRecipeCreator(props.recipe)"
        flat
        icon="edit"
        color="primary"
        @click="$router.push(`/recipes/${props.recipe._id}/update`)"
      />
      <q-btn
        v-if="recipeStore.userIsRecipeCreator(props.recipe)"
        flat
        icon="delete"
        color="negative"
        @click="$router.push(`/recipes/${props.recipe._id}/delete`)"
      />
    </q-card-actions>
  </q-card>
</template>
