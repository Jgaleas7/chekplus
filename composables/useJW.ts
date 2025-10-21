import type { SiteConfig, UiVideo } from '~/types/jw'

interface PlaylistPayload {
  id: string
  title: string
  description?: string
  videos: UiVideo[]
}

const memoryCache = new Map<string, Promise<any>>()
const CACHE_LIMIT = 30

function trimCache() {
  while (memoryCache.size > CACHE_LIMIT) {
    const oldestKey = memoryCache.keys().next().value
    if (!oldestKey) {
      break
    }
    memoryCache.delete(oldestKey)
  }
}

async function memoFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = memoryCache.get(key)
  if (cached) {
    return cached
  }

  const promise = fetcher()
    .then((data) => {
      memoryCache.set(key, Promise.resolve(data))
      trimCache()
      return data
    })
    .catch((error) => {
      memoryCache.delete(key)
      throw error
    })

  memoryCache.set(key, promise)
  return promise
}

export function useJW() {
  const fetchConfig = () => memoFetch<SiteConfig>('config', () => $fetch('/api/config'))

  const fetchPlaylist = (id: string) =>
    memoFetch<PlaylistPayload>(`playlist:${id}`, () => $fetch(`/api/playlist/${id}`))

  const fetchMedia = (id: string, playlistId?: string) =>
    memoFetch<UiVideo>(
      `media:${id}:${playlistId ?? ''}`,
      () => $fetch(`/api/media/${id}`, { params: playlistId ? { playlistId } : undefined })
    )

  return {
    fetchConfig,
    fetchPlaylist,
    fetchMedia
  }
}
