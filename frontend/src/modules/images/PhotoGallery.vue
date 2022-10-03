<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IImg } from './model'
import { useLinks } from 'src/components/use/links'
import DwUploader from 'src/components/core/dw-uploader'

interface IProps {
  label: string;
  filled: boolean;
  modelValue: IImg[];
  rules: any[] | undefined;
  uploader?: string;
  mainImg?: IImg | any;
  filter?: object | null;
}

const props = withDefaults(defineProps<IProps>(), {
  label: 'Photos',
  filled: false,
  modelValue: () => [] as IImg[]
})

const emit = defineEmits(['update:modelValue', 'setAsMainImg'])

const isAddPhotos = ref(false)
const hovered = ref<IImg | null>(null)
const imgs = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    return emit('update:modelValue', value)
  }
})
const { getUrl } = useLinks()

onMounted(() => {
  imgs.value = props.modelValue ? props.modelValue : []
})

function handleUpload (file: any) {
  console.log('handle file upload', file)
  const { _id, path } = file
  imgs.value.push({ _id, path })
}

function removeImg (img: IImg) {
  console.log('remove file(s)')
  imgs.value = imgs.value.filter(t => t._id !== img._id)
}

</script>

<template>
  <div class="row">
    <div class="col-12 q-py-md">
      <div class="row">
        <div class="text-h6">Photos</div>
        <q-space />
        <q-btn
          no-caps
          outline
          rounded
          label="Add Photos"
          @click="isAddPhotos = !isAddPhotos"
        />
      </div>
    </div>
    <div v-show="isAddPhotos" class="col-12 q-py-md">
      <dw-uploader
        label="Upload"
        autoremove
        :uploader="props.uploader"
        :filter="props.filter || {}"
        accept=".jpg, image/*"
        @uploaded="handleUpload"
        multiple
        style="width: 100%"
      />
    </div>
    <div class="full-height full-width q-gutter-y-sm">
      <transition-group
        class="row full-width full-width"
        appear
        enter-active-class="animated bounceIn"
        leave-active-class="animated bounceOut"
        tag="div"
        key="photo-gallery"
      >
        <div
          class="full-height col-12"
          v-for="img in imgs"
          :key="img.path"
        >
          <div class="q-pa-xs">
            <q-item
              class="q-pa-none"
              @mouseover="hovered=img"
              @mouseleave="hovered=null"
            >
              <q-img
                :src="getUrl(img.path) || 'https://cdn.quasar.dev/img/boy-avatar.png'"
              />
              <div
                v-if="hovered === img"
                class="row items-center justify-center absolute-full bg-black"
                style="opacity: 0.5"
              >
                <q-btn
                  color="white"
                  :icon="img._id === mainImg?._id ? `favorite` : 'favorite_outline'"
                  size="md"
                  round
                  flat
                  @click="emit('setAsMainImg', img)"
                />
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
  </div>
</template>
