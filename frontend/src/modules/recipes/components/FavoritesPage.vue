<script setup lang="ts">

import RecipesList from './RecipesList.vue'

</script>

<template>
  <q-page padding>
    <div class="col q-pa-none">
      <div class="row q-pa-sm q-pb-none">
        <div class="text-h5 text-weight-bold">
          Favorites
        </div>
      </div>
      <Suspense>
        <recipes-list favorites />
        <template #fallback>
          <q-inner-loading>
            <q-spinner-cube />
          </q-inner-loading>
        </template>
      </Suspense>
    </div>
  </q-page>
</template>
