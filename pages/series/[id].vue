<script setup lang="ts">
import { computed, ref } from 'vue'
import VideoCard from '~/components/VideoCard.vue'
import { useJW } from '~/composables/useJW'
import { useVideoStore } from '~/stores/videos'
import type { UiVideo } from '~/types/jw'

const route = useRoute()
const store = useVideoStore()
const { fetchMedia } = useJW()

const seriesId = computed(() => route.params.id as string)
const { data: series } = await useAsyncData(`series-${seriesId.value}`, () => fetchMedia(seriesId.value))

const episodes = ref<UiVideo[]>([])

if (series.value?.playlistId) {
  const playlist = await store.ensurePlaylist(series.value.playlistId)
  episodes.value = playlist.videos.filter((video) => video.id !== seriesId.value)
} else if (series.value?.seriesId) {
  try {
    const playlist = await store.ensurePlaylist(series.value.seriesId)
    episodes.value = playlist.videos.filter((video) => video.id !== seriesId.value)
  } catch (error) {
    console.warn('Series playlist unavailable', error)
  }
}

useHead({
  title: series.value?.title ?? 'Series'
})
</script>

<template>
  <section class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
    <NuxtLink to="/" class="text-sm font-semibold text-brand" prefetch>← Back to home</NuxtLink>
    <div class="flex flex-col gap-4">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">{{ series?.title }}</h1>
      <p v-if="series?.description" class="max-w-3xl text-slate-600 dark:text-slate-300">{{ series.description }}</p>
      <div v-if="series?.tags?.length" class="flex flex-wrap gap-2">
        <span
          v-for="tag in series.tags"
          :key="tag"
          class="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <section v-if="episodes.length" class="flex flex-col gap-6">
      <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Episodes</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <VideoCard
          v-for="episode in episodes"
          :key="episode.id"
          :video="episode"
          :to="episode.hls || episode.mp4 ? `/video/${episode.id}?playlistId=${episode.playlistId ?? series?.playlistId}` : `/series/${episode.id}`"
        />
      </div>
    </section>

    <div v-else class="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
      Episodes are coming soon.
    </div>
  </section>
</template>
