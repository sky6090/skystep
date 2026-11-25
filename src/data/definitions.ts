let cache: Map<string, string> | null = null
let loading: Promise<Map<string, string>> | null = null

export async function loadDefinitions(): Promise<Map<string, string>> {
  if (cache) return cache
  if (!loading) {
    loading = fetch(`${import.meta.env.BASE_URL}data/definitions.json`)
      .then((response) => {
        if (!response.ok) throw new Error('definitions unavailable')
        return response.json() as Promise<Record<string, string>>
      })
      .then((data) => {
        cache = new Map(Object.entries(data))
        return cache
      })
      .catch(() => {
        cache = new Map()
        return cache
      })
  }
  return loading
}
