<script setup lang="ts">
import { computed, reactive } from 'vue'
import VideoCard from '~/components/VideoCard.vue'
import { useJW } from '~/composables/useJW'
import { useVideoStore } from '~/stores/videos'
import type { UiVideo } from '~/types/jw'

const store = useVideoStore()
const { fetchConfig } = useJW()

const { data: config } = await useAsyncData('site-config', fetchConfig)

const shelves = reactive<Record<string, { title?: string; videos: UiVideo[] }>>({})

if (config.value) {
  await Promise.all(
    config.value.content
      .filter((entry) => entry.type === 'playlist')
      .map(async (entry) => {
        const playlist = await store.ensurePlaylist(entry.contentId)
        shelves[entry.contentId] = {
          title: entry.title ?? playlist.title,
          videos: playlist.videos
        }
      })
  )
}

const shelfEntries = computed(() => Object.entries(shelves))
</script>

<template>
  <section class="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10">
    <div class="flex flex-col gap-3">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Welcome to CHEK+</h1>
      <p class="max-w-2xl text-slate-600 dark:text-slate-300">
        Stream the latest CHEK content. Shelves are cached on the edge for instant page transitions.
      </p>
    </div>

    <div v-if="!shelfEntries.length" class="grid gap-4 md:grid-cols-2">
      <div v-for="index in 4" :key="index" class="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>

    <section v-for="[id, shelf] in shelfEntries" :key="id" class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">{{ shelf.title }}</h2>
        <NuxtLink :to="`/playlist/${id}`" class="text-sm font-semibold text-brand" prefetch>View all</NuxtLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <VideoCard
          v-for="video in shelf.videos"
          :key="video.id"
          :video="video"
          :to="video.hls || video.mp4 ? `/video/${video.id}?playlistId=${id}` : `/series/${video.id}`"
        />
      </div>
    </section>
  </section>
</template>
