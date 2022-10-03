// MyUploader.js
import { createUploaderComponent } from 'quasar'
import { ref, computed } from 'vue'
import axios from 'axios'

// export a Vue component
export default createUploaderComponent({
  // defining the QUploader plugin here

  name: 'DwUploader',

  props: {
    metadata: {
      type: Object,
      required: false,
      default: {}
    },
    autoremove: {
      type: Boolean,
      default: false
    },
    uploader: {
      type: String,
      required: false
    },
    filter: {
      type: Object,
      required: false
    }
  },

  emits: [
    'uploaded', 'removed', 'failed'
  ],

  injectPlugin ({ props, emit, helpers }) {
    // can call any other composables here
    // as this function will run in the component's setup()
    const uploading = ref<boolean>(false)
    const uploadedSize = ref<number>(0)
    const uploadTasks = ref<any[]>([])

    // [ REQUIRED! ]
    // We're working on uploading files
    const isUploading = computed(() => {
      return uploading.value
    })

    // [ optional ]
    // Shows overlay on top of the
    // uploader signaling it's waiting
    // on something (blocks all controls)
    const isBusy = computed(() => {
      return false
    })

    // [ REQUIRED! ]
    // Abort and clean up any process
    // that is in progress
    function abort () {
      // ...
      uploadTasks.value.forEach(uploadTask => {
        uploadTask.cancel()
      })
      uploading.value = false
    }

    // [ REQUIRED! ]
    // Start the uploading process
    async function upload () {
      if (!helpers.queuedFiles.value.length) {
        return
      }

      uploadedSize.value = 0
      uploading.value = true

      await helpers.queuedFiles.value.forEach(async (file: File) => {
        helpers.updateFileStatus(file, 'uploading', 0)
        const { name, type } = file
        const uploadTask = new FormData()
        uploadTask.append('name', name)
        uploadTask.append('type', type)
        uploadTask.append('uploader', props.uploader || 'daryl.pongcol')
        uploadTask.append('filterType', props.filter?.filterType || '')
        uploadTask.append('filterId', props.filter?.filterId || '')
        uploadTask.append('path', file)
        uploadTasks.value.push(uploadTask)
        try {
          const res = await axios.post('http://localhost:9090/upload', uploadTask)
          if (res.data.file) {
            console.log('File uploaded: ', res.data.file)
            helpers.updateFileStatus(file, 'uploaded')
            helpers.uploadedSize.value += file.size
            helpers.uploadedFiles.value.push(file)
            emit('uploaded', res.data.file)
          }
        } catch (error) {
          console.error(`File upload error ${file.name}: ${error}`)
          helpers.queuedFiles.value.push(file)
          helpers.updateFileStatus(file, 'failed')
          uploadTasks.value = uploadTasks.value.filter(t => t !== uploadTask)
          emit('failed', { file, error })
        } finally {
          uploadTasks.value = uploadTasks.value.filter(t => t !== uploadTask)
        }
      })

      uploading.value = false
    }

    return {
      isUploading,
      isBusy,

      abort,
      upload
    }
  }
})
