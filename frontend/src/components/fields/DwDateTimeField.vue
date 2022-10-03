<script setup lang="ts">

import { computed } from 'vue'

interface IProps {
  modelValue: Date;
  label: string;
  filled: boolean;
  mask?: string;
  rules?: any[] | undefined;
}

const props = withDefaults(defineProps<IProps>(), {
  label: 'Date and Time',
  filled: false,
  mask: 'YYYY-MM-DD HH:mm',
  modelValue: () => new Date()
})

const emit = defineEmits(['update:modelValue'])

const date = computed({
  get: (): Date => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

</script>

<template>
  <q-input :label="label" :filled="filled" v-model="date">
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="date" :mask="mask">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="date" :mask="mask" format24h>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
