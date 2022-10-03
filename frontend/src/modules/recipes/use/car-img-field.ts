import axios from 'axios'

export function useCarImgField () {
  function onUploadRejected () {
    console.log('onUploadRejected')
  }

  async function factoryUpload (files: any[]) {
    console.log('upload factory function', files)
    return new Promise((resolve, reject) => {
      files.forEach(async file => {
        try {
          const { name, type } = file
          const data = new FormData()
          data.append('name', name)
          data.append('type', type)
          data.append('uploader', 'daryl.pongcol')
          data.append('path', file)
          const res = await axios.post('http://localhost:9090/upload', data)
          console.log(res)
          resolve(res)
        } catch (err) {
          console.error(err)
          reject(err)
        }
      })
    })
  }

  return { factoryUpload, onUploadRejected }
}
