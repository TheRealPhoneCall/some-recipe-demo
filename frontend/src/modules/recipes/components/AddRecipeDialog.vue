<script setup lang="ts">
import { ref, computed, onMounted, toRef } from 'vue'
import { useUiStore } from 'src/stores/ui-store'
import { useUserAuthStore } from 'src/modules/auth/store'
import { useRecipeStore } from '../store'
import { IRecipe } from '../model'
import PhotoGallery from 'src/modules/images/PhotoGallery.vue'
import DwIngredients from './fields/DwIngredients.vue'
import DwRecipeSteps from './fields/DwRecipeSteps.vue'

const addRecipeForm = ref<HTMLFormElement | null>(null)
const step = ref(1)

const uiStore = useUiStore()
const authStore = useUserAuthStore()
const recipeStore = useRecipeStore()
const recipe = toRef(recipeStore, 'recipe')
const recipeTypes = [
  { value: 'pastry', label: 'Pastry' },
  { value: 'pasta', label: 'Pasta' },
  { value: 'fruits-and-veggies', label: 'Fruits and Vegetables' },
  { value: 'appetizer', label: 'Appetizer' }
]

const photoFilter = computed(() => {
  return {
    filterId: recipe.value?._id,
    filterType: 'recipes'
  }
})

onMounted(() => {
  recipeStore.resetDocDefault()
})

async function stepRecipeCreate () {
  const creator = authStore.userMin
  const payload = { ...recipe.value, creator }

  console.log('Adding recipe: ', payload)
  try {
    await recipeStore.addDoc(payload)
    if (recipeStore.error) {
      console.error('error in stepCreate', recipeStore.error)
    } else {
      step.value = 2
    }
  } catch (e) {
    console.error(e)
  }
}

async function stepUploadPhotos () {
  const { _id, photo, photos } = recipe.value as IRecipe
  const payload = { _id, photo, photos }

  console.log('Upload photos: ', payload)
  try {
    await recipeStore.updateDoc(payload)
    if (recipeStore.error) {
      console.error('error in stepUploadPhotos', recipeStore.error)
    } else {
      step.value = 3
    }
  } catch (e) {
    console.error('error in stepUploadPhotos', e)
  }
}

async function stepIngredients () {
  const { _id, ingredients } = recipe.value as IRecipe
  const payload = { _id, ingredients }

  console.log('Upload photos: ', payload)
  try {
    await recipeStore.updateDoc(payload)
    if (recipeStore.error) {
      console.error('error in stepIngredients', recipeStore.error)
    } else {
      step.value = 4
    }
  } catch (e) {
    console.error('error in stepIngredients', e)
  }
}

async function stepRecipeSteps () {
  const { _id, steps } = recipe.value as IRecipe
  const payload = { _id, steps }

  console.log('Upload photos: ', payload)
  try {
    await recipeStore.updateDoc(payload)
    if (recipeStore.error) {
      console.error('error in stepRecipeSteps', recipeStore.error)
    } else {
      step.value = 3
    }
  } catch (e) {
    console.error('error in stepRecipeSteps', e)
  }
  uiStore.addRecipeDialog = false
}

</script>

<template>
  <q-dialog
    v-model="uiStore.addRecipeDialog"
    position="bottom"
    full-height
    maximized
  >
    <q-card
      ref="addRecipeForm"
      v-if="recipe"
      class="q-pa-none"
      style="width: 80rem"
      flat
    >
      <q-card-actions class="q-pl-sm">
        <div
          class="text-weight-medium q-pl-md q-pt-md"
          style="font-size: 1.8rem"
        >
          Add Recipe
        </div>
        <q-space />
        <q-btn
          color="grey-7"
          dense
          size="md"
          flat
          icon="close"
          v-close-popup
        />
      </q-card-actions>
      <q-card-section class="q-pa-none">
        <q-stepper
          v-model="step"
          ref="stepper"
          alternative-labels
          color="primary"
          class="full-width q-pa-none"
          animated
          vertical
          flat
        >
          <q-step
            :name="1"
            title="Description"
            icon="settings"
            :done="step > 1"
            class="q-pa-none"
          >
            <div class="row">
              <div class="col q-pa-none">
                <q-input
                  filled
                  v-model="recipe.name"
                  debounce="500"
                  label="Name"
                  lazy-rules
                  dense
                  :rules="[ val => val && val.length || 'Please name this recipe' ]"
                />
                <q-field
                  v-model="recipe.desc"
                  debounce="500"
                  lazy-rules
                  dense
                  :rules="[
                    val => val !== null && val !== '' ||
                    'Please give a general description of the recipe'
                  ]"
                >
                  <q-editor
                    mid-height="5rem"
                    v-model="recipe.desc"
                    class="fit text-black"
                  />
                </q-field>

                <q-select
                  filled
                  v-model="recipe.type"
                  :options="recipeTypes"
                  emit-value
                  label="Recipe Type"
                  dense
                  :rules="[ val => val && val.length > 0 || 'Please select the type of this recipe']"
                />

              </div>
            </div>
            <div v-show="recipeStore.error" class="text-negative">
              {{recipeStore.error}}
            </div>
            <q-stepper-navigation>
              <q-btn
                @click="stepRecipeCreate()"
                :loading="recipeStore.loading"
                color="primary"
                label="Continue"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            :name="2"
            title="Add photos for this car"
            icon="media"
            :done="step > 2"
            class="q-pa-none"
          >
            <div class="col q-pa-none">
              <photo-gallery
                v-model="recipe.photos"
                filled
                :uploader="authStore.authedUser?.username"
                :filter="photoFilter"
                label="Photos"
                :main-img="recipe.photo"
                @set-as-main-img="img => recipe.photo = img"
                class="full-width"
                :rules="[
                  val => val !== {} ||
                  'Please upload photos for this recipe'
                ]"
              />
            </div>
            <div v-show="recipeStore.error" class="text-negative">
              {{recipeStore.error}}
            </div>
            <q-stepper-navigation class="q-gutter-x-md">
              <q-btn
                @click="stepUploadPhotos()"
                color="primary"
                label="Continue"
              />
              <q-btn
                @click="step = 1"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            :name="3"
            title="Ingredients"
            icon="fa-solid fa-bowl-food"
            :done="step > 3"
            class="q-pa-none"
          >
            <dw-ingredients
              v-model="recipe.ingredients"
              editable
            />
            <div v-show="recipeStore.error" class="text-negative">
              {{recipeStore.error}}
            </div>
            <q-stepper-navigation class="q-gutter-x-md">
              <q-btn
                @click="stepIngredients()"
                color="primary"
                label="Continue"
              />
              <q-btn
                @click="step = 1"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            :name="4"
            title="Steps"
            icon="fa-solid fa-bowl-food"
            :done="step > 4"
            class="q-pa-none"
          >

            <dw-recipe-steps
              v-model="recipe.steps"
              editable
            />
            <div v-show="recipeStore.error" class="text-negative">
              {{recipeStore.error}}
            </div>
            <q-stepper-navigation class="q-gutter-x-md">
              <q-btn
                @click="stepRecipeSteps()"
                color="primary"
                label="Finish"
              />
              <q-btn
                @click="step = 1"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
