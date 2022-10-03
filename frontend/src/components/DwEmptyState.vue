<script setup lang="ts">

interface IProps {
  imgSrc?: string;
  imgStyle: string;
  title: string;
  message: string;
  hasBtn: boolean;
  btnLabel: string;
  btnStyle: {
    icon: string;
    color: string;
    outline: boolean;
    rounded: boolean;
  }
}

const props = withDefaults(defineProps<IProps>(), {
  imgStyle: 'width:30vw; max-width:150px;',
  hasBtn: false,
  imgSrc: '~assets/no-food.png',
  btnStyle: () => ({
    icon: 'add',
    color: 'primary',
    outline: true,
    rounded: true
  })
})
const emit = defineEmits(['addRecord'])

</script>
<template>
  <div class="row text-center">
    <div class="col text-center q-pa-lg">
      <img
        src="~assets/no-food.png"
        :style="props.imgStyle"
      />
      <br />
      <br />
      <p v-if="props.title" class="text-faded text-bold text-h6">{{ props.title }}</p>
      <p v-if="props.message" class="text-faded"><span v-html="props.message"></span></p>
      <q-btn
        v-if="props.hasBtn"
        :label="props.btnLabel"
        :icon="props.btnStyle.icon"
        :color="props.btnStyle.color"
        :outline="props.btnStyle.outline"
        :rounded="props.btnStyle.rounded"
        no-caps
        @click="$emit('addRecord')"
      />
    </div>

  </div>
</template>
