<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  label: string;
  filled?: boolean;
  modelValue: boolean;
  fieldValue: string;
  rules?: any[] | undefined;
}

const props = withDefaults(defineProps<IProps>(), {
  label: 'Photos',
  filled: false,
  modelValue: false,
  fieldValue: ''
})

const emit = defineEmits(['update:modelValue', 'onFieldEdit', 'onSave'])

const open = computed({
  get: (): boolean => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const field = computed({
  get: (): string => props.fieldValue,
  set: (value: string) => emit('onFieldEdit', value)
})

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
        <q-editor
          mid-height="2rem"
          v-model="field"
          class="fit text-black"
        />
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          flat
          icon="save"
          label="Save"
          @click="emit('onSave')"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
