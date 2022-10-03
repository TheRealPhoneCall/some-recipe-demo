<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DwUploader from '../core/dw-uploader'
import { useLinks } from 'src/components/use/links'

interface IImg {
  _id: string;
  path: string;
}

interface IProps {
  label: string;
  filled: boolean;
  modelValue: IImg;
  rules: any[] | undefined;
  uploader?: string;
  filter?: object | null;
}

const props = withDefaults(defineProps<IProps>(), {
  label: 'Photo',
  filled: false,
  modelValue: () => ({} as IImg)
})

const emit = defineEmits(['update:modelValue'])

const hover = ref<boolean>(false)
const img = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    return emit('update:modelValue', value)
  }
})
const { getUrl } = useLinks()

function handleUpload (file: any) {
  console.log('handle file upload', file)
  const { _id, path } = file
  img.value = { _id, path }
}

function removePhoto () {
  if (img.value?._id) {
    img.value = {} as IImg
  }
}

onMounted(() => {
  img.value = (props.modelValue ? props.modelValue : {} as IImg)
})

</script>

<template>
  <div>
    <dw-uploader
      label="Upload"
      autoremove
      :uploader="props.uploader"
      :filter="props.filter || {}"
      accept=".jpg, image/*"
      @uploaded="handleUpload"
      style="width: 100%"
    />
    <br />
    <q-field
      v-if="img._id"
      v-model="img"
      bottom-slots
      :label="label"
      :filled="filled"
      lazy-rules
      stack-label
      :rules="rules"
    >
      <template v-slot:control>
        <div class="full-height full-width q-gutter-y-sm">
          <q-item
            class="q-pa-none"
            @mouseover="hover=true"
            @mouseleave="hover=false"
          >
            <q-img
              :src="img ? getUrl(img.path): ''"
              :ratio="1"
              style="height:200px; max-width: 200px"
            />
            <div
              v-if="hover && img"
              class="row items-center justify-center absolute-full bg-black"
              style="opacity: 0.7"
            >
              <q-btn
                color="white"
                icon="close"
                size="md"
                round
                flat
                @click="removePhoto"
              />
            </div>
          </q-item>
        </div>
      </template>
    </q-field>
  </div>
</template>
