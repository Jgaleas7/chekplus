import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useJW } from '~/composables/useJW'
import type { UiVideo } from '~/types/jw'

interface PlaylistCacheEntry {
  id: string
  title: string
  description?: string
  videos: UiVideo[]
}

export const useVideoStore = defineStore('videos', () => {
  const playlists = reactive<Record<string, PlaylistCacheEntry>>({})
  const favorites = useLocalStorage<string[]>('chekplus-favorites', [])

  const jw = useJW()

  const allVideos = computed(() =>
    Object.values(playlists)
      .flatMap((entry) => entry.videos)
      .reduce<Record<string, UiVideo>>((map, video) => {
        if (!map[video.id]) {
          map[video.id] = video
        }
        return map
      }, {})
  )

  const favoriteVideos = computed(() => favorites.value.map((id) => allVideos.value[id]).filter(Boolean))

  const isFavorite = (id: string) => favorites.value.includes(id)

  function toggleFavorite(id: string) {
    const current = new Set(favorites.value)
    if (current.has(id)) {
      current.delete(id)
    } else {
      current.add(id)
    }
    favorites.value = Array.from(current)
  }

  async function ensurePlaylist(id: string) {
    if (playlists[id]) {
      return playlists[id]
    }
    const payload = await jw.fetchPlaylist(id)
    playlists[id] = payload
    return payload
  }

  function setPlaylist(payload: PlaylistCacheEntry) {
    playlists[payload.id] = payload
  }

  function getVideo(id: string) {
    return allVideos.value[id]
  }

  function searchVideos(query: string) {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return [] as UiVideo[]
    }
    return Object.values(allVideos.value).filter((video) => {
      const haystack = [video.title, video.description, ...(video.tags ?? [])]
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalized)
    })
  }

  return {
    playlists,
    favorites,
    favoriteVideos,
    isFavorite,
    toggleFavorite,
    ensurePlaylist,
    setPlaylist,
    getVideo,
    searchVideos
  }
})
