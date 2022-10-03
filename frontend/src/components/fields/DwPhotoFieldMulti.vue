<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DwUploader from '../core/dw-uploader'

interface IImg {
  id: string;
  url: string;
}

interface IProps {
  label: string;
  filled: boolean;
  modelValue: IImg[] | null;
  rules: any[] | undefined;
  uploader?: string;
  filter?: object | null;
}

const props = withDefaults(defineProps<IProps>(), {
  label: 'Photos',
  filled: false,
  modelValue: null
})

const emit = defineEmits(['update:modelValue'])

const imgs = ref<IImg[]>([])
const hovered = ref<IImg | null>(null)

onMounted(() => {
  imgs.value = props.modelValue ? props.modelValue : []
})

function handleUpload (file: any) {
  console.log('handle file upload', file)
  const { id, url } = file
  imgs.value.push({ url, id })
  emit('update:modelValue', imgs.value)
}

function removeImg (img: IImg) {
  console.log('remove file(s)')
  imgs.value = imgs.value.filter(t => t.id !== img.id)
  emit('update:modelValue', imgs.value)
}

</script>

<template>
  <div>
    <dw-uploader
      label="Upload"
      :autoremove="true"
      :uploader="props.uploader"
      :filter="props.filter || {}"
      accept=".jpg, image/*"
      @upload="handleUpload"
      multiple
      style="width: 100%"
    />
    <br/>
    <q-field
      v-if="imgs.length"
      :value="imgs"
      bottom-slots
      :label="label"
      :filled="filled"
      lazy-rules
      stack-label
      :rules="rules"
    >
      <template v-slot:control>
        <div class="full-height full-width q-gutter-y-sm">
          <transition-group
            class="row full-width full-width"
            appear
            enter-active-class="animated bounceIn"
            leave-active-class="animated bounceOut"
            tag="div"
          >
            <div
              class="full-height col-6"
              v-for="img in imgs"
              :key="img.url"
            >
              <div class="q-pa-xs">
                <q-item
                  class="q-pa-none"
                  @mouseover="hovered=img"
                  @mouseleave="hovered=null"
                >
                  <q-img
                    :src="img.url"
                    :ratio="1"
                    style="height:200px; max-width: 200px"
                  />
                  <div
                    v-if="hovered === img"
                    class="row items-center justify-center absolute-full bg-black"
                    style="opacity: 0.7"
                  >
                    <q-btn
                      color="white"
                      icon="close"
                      size="md"
                      round
                      flat
                      @click="removeImg(img)"
                    />
                  </div>
                </q-item>
              </div>
            </div>
          </transition-group>
        </div>
      </template>
    </q-field>
  </div>
</template>
