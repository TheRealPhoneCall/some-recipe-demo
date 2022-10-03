<script setup lang="ts">

import { ref, computed } from 'vue'
import { IRecipeStep } from '../../model'
import DwEditModal from 'src/components/fields/DwEditModal.vue'

interface IProps {
  modelValue: IRecipeStep[];
  label?: string;
  editable: boolean;
  rules?: any[] | undefined;
}

const props = withDefaults(defineProps<IProps>(), {
  editable: false,
  modelValue: () => ([] as IRecipeStep[])
})

const emit = defineEmits(['update:modelValue'])

const steps = computed({
  get: (): IRecipeStep[] => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const newStep = ref<IRecipeStep>({ step: 1, desc: '' })
const editModal = ref(false)
const addModal = ref(false)

function appendStep () {
  steps.value = [
    ...steps.value,
    newStep.value
  ]
  newStep.value = { step: steps.value.length + 1, desc: '' }
}

</script>

<template>
  <div class="col q-pa-none q-gutter-y-none">
    <div class="text-weight-bold" v-if="steps.length || props.editable">
      {{ props.label }}
    </div>
    <div v-if="props.editable">
      <q-field
        v-for="(step, idx) of steps"
        :key="`ingredient-${idx}`"
        bottom-slots
        v-model="step.desc"
        :label="`Step ${step.step}`"
        class="q-pb-none"
        dense
        borderless
      >
        <span
          v-html="step.desc"
        ></span>
        <dw-edit-modal
          v-model="editModal"
          :label="`Edit Step ${step.step}`"
          :field-value="step.desc"
          @onFieldEdit="(val) => step.desc = val"
        />
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-stop" />
        </template>
        <template v-slot:append>
          <q-icon name="edit" @click="editModal = true" />
        </template>
      </q-field>
      <q-field
        borderless
        dense
        class="q-pa-none q-ma-none"
      >
        <q-btn
          color="grey-3"
          align="left"
          class="text-grey-7 full-width q-pl-md q-pa-none q-ma-none"
          label="Add a step"
          @click="addModal=true"
          size="md"
          no-caps
          dense
          unelevated
        />
        <template v-slot:before>
          <q-icon name="fa-solid fa-square-plus" />
        </template>
      </q-field>
      <dw-edit-modal
        v-model="addModal"
        label="Add a step"
        :field-value="newStep.desc"
        @onFieldEdit="(val) => newStep.desc = val"
        @onSave="appendStep()"
      />
    </div>
    <div v-else>
      <q-list class="q-pa-none">
        <q-item
          clickable
          v-ripple
          class="q-pa-none q-pb-md"
          v-for="(step, idx) of steps"
          :key="`ingredient-${idx}`"
          dense
        >
          <q-item-section top avatar class="q-pa-none">
            <q-icon name='fa-solid fa-stop' color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Step {{ idx + 1 }}</q-item-label>
            <q-item-label><span v-html="step.desc"></span></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

  </div>
</template>
