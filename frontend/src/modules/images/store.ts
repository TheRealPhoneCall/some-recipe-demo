import { ref } from 'vue'
import { defineStore } from 'pinia'
import { IImg } from 'src/modules/images/model'
import { useRest } from 'src/stores/use/rest'

export const useImgStore = defineStore('img', () => {
  const images = ref<IImg[]>([])
  const img = ref<IImg | null>(null)

  const { loading, error, data, runRest } = useRest()

  async function getImages (payload?: object | undefined) {
    console.log('pinia action getImages')
    await runRest('get', 'http://localhost:9090/images/', payload)
    images.value = data.value?.images || images.value
  }

  async function getImg (payload: string) {
    console.log('pinia action getImg')
    img.value = null
    await runRest('get', `http://localhost:9090/images/${payload}`, payload)
    img.value = data.value?.img || img.value
    console.log('img', img.value)
  }

  async function addImg (payload: IImg | any) {
    console.log('pinia action addImg')
    await runRest('post', 'http://localhost:9090/images/', payload)
    if (data.value && data.value.img) {
      img.value = data.value.img
      images.value.push(data.value.img as IImg)
    }
  }

  async function updateImg (payload: IImg | any) {
    console.log('pinia action updateImg')
    await runRest('patch', `http://localhost:9090/images/${payload._id}`, payload)
    console.log(data.value)
    if (data.value && data.value.img) {
      img.value = data.value.img
      const idx = images.value.findIndex(t => t._id === payload.id)
      if (idx > -1) {
        images.value[idx] = data.value.img
      }
    }
  }

  async function deleteImg (payload: string) {
    console.log('pinia action deleteImg')
    await runRest('delete', `http://localhost:9090/images/${payload}`, payload)
    console.log(data.value)
    if (data.value.img) {
      img.value = null
      images.value.filter(t => t._id !== payload)
    }
  }

  return {
    images,
    img,
    loading,
    error,
    getImages,
    getImg,
    addImg,
    updateImg,
    deleteImg
  }
})
