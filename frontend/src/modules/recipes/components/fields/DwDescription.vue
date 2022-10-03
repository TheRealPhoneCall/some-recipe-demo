<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  label: string;
  filled?: boolean;
  modelValue: boolean;
  title: string;
  desc: string;
  type: string;
}

const props = withDefaults(defineProps<IProps>(), {
  label: 'Description',
  filled: false,
  modelValue: false,
  title: '',
  desc: '',
  type: ''
})

const emit = defineEmits(['update:modelValue', 'update:title', 'update:desc', 'update:type'])

const open = computed<boolean>({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const title = computed<string>({
  get: () => props.title,
  set: (value) => emit('update:title', value)
})

const desc = computed<string>({
  get: () => props.desc,
  set: (value) => emit('update:desc', value)
})

const type = computed<string>({
  get: () => props.type,
  set: (value) => emit('update:type', value)
})

const recipeTypes = [
  { value: 'pastry', label: 'Pastry' },
  { value: 'pasta', label: 'Pasta' },
  { value: 'fruits-and-veggies', label: 'Fruits and Vegetables' },
  { value: 'appetizer', label: 'Appetizer' }
]

</script>

<template>
  <q-dialog
    v-model="open"
  >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">{{ props.label }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          filled
          v-model="title"
          debounce="500"
          label="Name"
          lazy-rules
          dense
          :rules="[ val => val && val.length || 'Please name this recipe' ]"
        />
        <q-editor
          mid-height="2rem"
          v-model="desc"
          class="fit text-black"
        />
        <q-select
          filled
          v-model="type"
          :options="recipeTypes"
          emit-value
          label="Recipe Type"
          dense
          :rules="[ val => val && val.length > 0 || 'Please select the type of this recipe']"
        />
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          flat
          icon="save"
          label="Ok"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
