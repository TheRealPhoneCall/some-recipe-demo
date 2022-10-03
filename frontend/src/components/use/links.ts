export function useLinks () {
  function getUrl (relativePath: string) {
    return relativePath ? `http://localhost:9090/${relativePath}` : ''
  }

  return { getUrl }
}
