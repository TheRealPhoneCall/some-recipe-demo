<script setup lang="ts">
import { ref, onMounted, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { useLinks } from 'src/components/use/links'
import { useRecipeStore } from '../store'
import DwDescription from './fields/DwDescription.vue'
import DwIngredients from './fields/DwIngredients.vue'
import DwRecipeSteps from './fields/DwRecipeSteps.vue'

interface IProps {
  operation: string
  id: string | undefined
}

const props = withDefaults(defineProps<IProps>(), {
  operation: 'retrieve',
  id: undefined
})

const recipeForm = ref<HTMLFormElement | null>(null)
const slide = ref(0)
const rating = 4.5
const descModal = ref(false)

const router = useRouter()
const recipeStore = useRecipeStore()
const recipe = toRef(recipeStore, 'recipe')
const { getUrl } = useLinks()

onMounted(async () => {
  await recipeStore.getDoc(props.id)
})

async function onSubmit () {
  console.log('Submitting form')
  if (recipeForm.value?.validate()) {
    if (props.operation === 'create') {
      await recipeStore.addDoc(recipe.value)
    } else if (props.operation === 'update') {
      await recipeStore.updateDoc(recipe.value)
    } else if (props.operation === 'delete') {
      await recipeStore.deleteDoc(recipe.value._id as string)
    }
    router.push('/recipes')
  }
}

</script>

<template>
  <q-page
    padding
    class="q-pa-md"
  >
    <q-form
      ref="recipeForm"
      @submit="onSubmit"
    >
      <q-card v-if="recipe" class="my-card">
        <q-carousel
          swipeable
          animated
          padding
          arrows
          v-model="slide"
          thumbnails
          infinite
        >
          <q-carousel-slide
            v-for="(photo, idx) in recipeStore.recipePhotos"
            :key="photo._id"
            :name="idx"
            :img-src="getUrl(photo.path as string)"
            style="height: 50rem; width: auto"
          />
        </q-carousel>

        <q-card-section>
          <q-btn
            fab
            color="primary"
            :icon="recipeStore.userLikesRecipe(recipe) ? `favorite` : 'favorite_outline'"
            class="absolute"
            @click="recipeStore.toggleRecipeLike(recipe)"
            style="top: 0; right: 12px; transform: translateY(-50%);"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ recipe.name }}
            </div>
          </div>

          <q-rating :modelValue="rating" :max="5" size="25px" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row text-subtitle1">
            By: {{ recipe.creator.displayName }}
            <q-space />
            <q-icon name="edit" @click="descModal = true" />
          </div>
          <div class="text-caption text-grey">
            <span v-html="recipe.desc"></span>
          </div>
          <dw-description
            label="Description"
            v-model="descModal"
            :title="recipe.name"
            @update:title="(val) => recipe.name = val"
            :desc="recipe.desc"
            @update:desc="(val) => recipe.desc = val"
            :type="recipe.type"
            @update:type="(val) => recipe.type = val"
          />
        </q-card-section>

        <q-card-section>
          <dw-ingredients
            label="Ingredients"
            v-model="recipe.ingredients"
            :editable="['create', 'update'].includes(props.operation)"
          />
        </q-card-section>

        <q-card-section>
          <dw-recipe-steps
            label="Steps"
            v-model="recipe.steps"
            :editable="['create', 'update'].includes(props.operation)"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            label="Delete"
            color="negative"
            type="submit"
            v-if="operation === 'delete'"
            :loading="recipeStore.loading"
          />
          <q-btn
            label="Submit"
            type="submit"
            v-if="['update', 'create'].includes(props.operation)"
            color="primary"
            :loading="recipeStore.loading"
          />
          <q-btn
            label="Back"
            color="primary"
            flat
            to="/recipes"
          />

        </q-card-actions>
      </q-card>

    </q-form>
  </q-page>
</template>
