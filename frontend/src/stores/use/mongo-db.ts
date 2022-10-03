import { ref } from 'vue'
import { useRest } from 'src/stores/use/rest'

interface IInjector {
  docSample: any;
  docDefault: any;
}
interface IPrevNext {
  page: number;
  limit: number;
}
export function useMongoDb (injector: IInjector) {
  const doc = ref<typeof injector.docSample>(injector.docDefault())
  const docs = ref<typeof injector.docSample[]>([])
  const naming = ref({
    docName: 'doc',
    colName: 'docs'
  })
  const baseUrl = ref('')
  const nextPage = ref<IPrevNext | null>(null)
  const previousPage = ref<IPrevNext | null>(null)
  const docsCount = ref(0)

  const { loading, error, data, convertIfFiltered, runRest } = useRest()

  function resetDocDefault () {
    doc.value = injector.docDefault()
  }

  async function getDocs (payload?: any | null) {
    const { method, url, config } = convertIfFiltered(baseUrl.value, payload)
    await runRest(method, url, payload, config)

    // for paginated fetching
    if (data.value && data.value.pagination?.previous) {
      previousPage.value = data.value.pagination.previous
    }
    if (data.value && data.value.pagination?.next) {
      nextPage.value = data.value.pagination.next
    }
    if (data.value && data.value.pagination?.docsCount) {
      docsCount.value = data.value.pagination.docsCount
    }

    if (data.value && data.value[naming.value.colName]) {
      if (payload?.append) {
        docs.value = [...docs.value, ...data.value[naming.value.colName]]
      } else {
        docs.value = data.value[naming.value.colName]
      }
    }
    return docs.value
  }

  async function getDoc (payload: string) {
    resetDocDefault()
    await runRest('get', `${baseUrl.value}/${payload}`)
    if (data.value && data.value[naming.value.docName]) {
      doc.value = data.value[naming.value.docName]
    }
    return doc.value
  }

  async function addDoc (payload: typeof injector.docSample) {
    await runRest('post', baseUrl.value, payload)
    if (data.value && data.value[naming.value.docName]) {
      doc.value = data.value[naming.value.docName]
      docs.value.push(data.value[naming.value.docName])
    }
    return doc.value
  }

  async function updateDoc (payload: typeof injector.docSample) {
    await runRest('patch', `${baseUrl.value}/${payload._id}`, payload)
    if (data.value && data.value[naming.value.docName]) {
      doc.value = data.value[naming.value.docName]
      const idx = docs.value.findIndex((t: typeof injector.docSample) => t._id === payload._id)
      if (idx > -1) {
        docs.value[idx] = data.value[naming.value.docName]
      }
    }
    return doc.value
  }

  async function deleteDoc (payload: string) {
    await runRest('delete', `${baseUrl.value}/${payload}`, payload)
    if (data.value[naming.value.docName]) {
      docs.value.filter((t: typeof injector.docSample) => t._id !== payload)
      resetDocDefault()
    }
  }

  return {
    docs,
    doc,
    nextPage,
    previousPage,
    docsCount,
    naming,
    loading,
    error,
    baseUrl,
    resetDocDefault,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc
  }
}
