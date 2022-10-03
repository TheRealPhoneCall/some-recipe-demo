<script setup lang="ts">

import { ref } from 'vue'
import { useUiStore } from 'src/stores/ui-store'
import RecipesList from './RecipesList.vue'
import AddRecipeDialog from './AddRecipeDialog.vue'

const uiStore = useUiStore()
const searchMode = ref(false)
const searchText = ref('')

</script>

<template>
  <q-page padding>
    <div class="col q-pa-none">
      <div class="row q-pa-sm q-pb-none">
        <div class="text-h5 text-weight-bold">
          Recipes
        </div>
        <q-space />
        <q-btn
          flat
          icon="search"
          @click="searchMode = true"
        />
        <q-btn
          color="primary"
          fab-mini
          @click="uiStore.addRecipeDialog = true"
          icon="add"
        />
      </div>
      <div v-if="searchMode" class="row q-pa-none">
        <q-input
          rounded
          standout="bg-primary text-white"
          bottom-slots
          v-model="searchText"
          autofocus
          class="full-width"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click="searchMode = false" class="cursor-pointer" />
          </template>
        </q-input>
      </div>
      <Suspense>
        <recipes-list :search-text="searchText" class="col" />
        <template #fallback>
          <q-inner-loading>
            <q-spinner-cube />
          </q-inner-loading>
        </template>
      </Suspense>

    </div>
    <add-recipe-dialog />
  </q-page>
</template>
