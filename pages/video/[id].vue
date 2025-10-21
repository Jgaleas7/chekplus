<script setup lang="ts">
import { computed } from 'vue'
import Player from '~/components/Player.vue'
import VideoCard from '~/components/VideoCard.vue'
import { useJW } from '~/composables/useJW'
import { useVideoStore } from '~/stores/videos'

const route = useRoute()
const store = useVideoStore()
const { fetchMedia } = useJW()

const mediaId = computed(() => route.params.id as string)
const playlistId = computed(() => (route.query.playlistId as string | undefined) ?? undefined)

const { data: video } = await useAsyncData(
  `media-${mediaId.value}-${playlistId.value ?? 'none'}`,
  () => fetchMedia(mediaId.value, playlistId.value)
)

if (playlistId.value) {
  await store.ensurePlaylist(playlistId.value)
}

const relatedVideos = computed(() => {
  if (!playlistId.value) return []
  const playlist = store.playlists[playlistId.value]
  if (!playlist) return []
  return playlist.videos.filter((item) => item.id !== mediaId.value).slice(0, 8)
})

const isFavorite = computed(() => (video.value ? store.isFavorite(video.value.id) : false))

function toggleFavorite() {
  if (video.value) {
    store.toggleFavorite(video.value.id)
  }
}

useHead({
  title: video.value?.title ?? 'Video detail'
})
</script>

<template>
  <section class="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
    <NuxtLink to="/" class="text-sm font-semibold text-brand" prefetch>← Back to home</NuxtLink>
    <div v-if="!video" class="flex flex-col gap-6">
      <div class="aspect-video w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div class="h-6 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div class="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
    </div>
    <div v-else class="flex flex-col gap-6">
      <Player :video="video" />
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-4">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">{{ video.title }}</h1>
          <button
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-300"
            type="button"
            @click="toggleFavorite"
          >
            <span v-if="isFavorite">★ Saved</span>
            <span v-else>☆ Save to favorites</span>
          </button>
        </div>
        <p v-if="video.description" class="text-base text-slate-600 dark:text-slate-300">
          {{ video.description }}
        </p>
        <div v-if="video.tags?.length" class="flex flex-wrap gap-2">
          <span
            v-for="tag in video.tags"
            :key="tag"
            class="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <section v-if="relatedVideos.length" class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">More from this playlist</h2>
        <NuxtLink
          v-if="playlistId"
          :to="`/playlist/${playlistId}`"
          class="text-sm font-semibold text-brand"
          prefetch
        >
          View playlist
        </NuxtLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <VideoCard
          v-for="item in relatedVideos"
          :key="item.id"
          :video="item"
          :to="
            item.hls || item.mp4
              ? `/video/${item.id}${playlistId ? `?playlistId=${playlistId}` : ''}`
              : `/series/${item.id}`
          "
        />
      </div>
    </section>
  </section>
</template>
