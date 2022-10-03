<script setup lang="ts">

import { ref, computed } from 'vue'

interface IProps {
  modelValue: string[];
  label?: string;
  editable: boolean;
  rules?: any[] | undefined;
}

const props = withDefaults(defineProps<IProps>(), {
  editable: false,
  modelValue: () => ([] as string[])
})

const emit = defineEmits(['update:modelValue'])

const ingredients = computed({
  get: (): string[] => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const newIngredient = ref('')

function appendIngredient () {
  ingredients.value = [
    ...ingredients.value,
    newIngredient.value
  ]
  newIngredient.value = ''
}

</script>

<template>
  <div class="col q-pa-none q-gutter-y-none">
    <div class="text-weight-bold">
      {{ props.label }}
    </div>
    <div v-if="props.editable">
      <q-input
        standout="primary"
        v-for="(ingredient, idx) of ingredients"
        :key="`ingredient-${idx}`"
        class="q-pb-none"
        bottom-slots
        dense
        v-model="ingredients[idx]"
        borderless
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-stop" />
        </template>
      </q-input>
      <q-input
        color="primary"
        standout="bg-primary text-white"
        bottom-slots
        v-model="newIngredient"
        @keyup.enter="appendIngredient"
        label="Add an ingredient"
        outline
        clearable
        dense
      >
        <template v-slot:before>
          <q-icon name="fa-solid fa-square-plus" />
        </template>
      </q-input>
    </div>
    <div v-else class="q-pa-none">
      <q-list class="q-pa-none">
        <q-item
          clickable
          v-ripple
          class="q-pa-none"
          v-for="(ingredient, idx) of ingredients"
          :key="`ingredient-${idx}`"
          dense
        >
          <q-item-section avatar class="q-pa-none">
            <q-icon name='fa-solid fa-stop' color="primary" />
          </q-item-section>
          <q-item-section>
            {{ ingredient }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
