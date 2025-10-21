<script setup lang="ts">
import { computed } from 'vue'
import VideoCard from '~/components/VideoCard.vue'
import { useVideoStore } from '~/stores/videos'

const route = useRoute()
const store = useVideoStore()
const playlistId = computed(() => route.params.id as string)

const { data: playlist } = await useAsyncData(`playlist-${playlistId.value}`, () => store.ensurePlaylist(playlistId.value))

useHead({
  title: playlist.value?.title ?? 'Playlist'
})
</script>

<template>
  <section class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
    <div class="flex flex-col gap-2">
      <NuxtLink to="/" class="text-sm font-semibold text-brand" prefetch>← Back to home</NuxtLink>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">{{ playlist?.title }}</h1>
      <p v-if="playlist?.description" class="max-w-3xl text-slate-600 dark:text-slate-300">{{ playlist.description }}</p>
    </div>

    <div v-if="!playlist" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="index in 6" :key="index" class="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <VideoCard
        v-for="video in playlist.videos"
        :key="video.id"
        :video="video"
        :to="video.hls || video.mp4 ? `/video/${video.id}?playlistId=${playlist.id}` : `/series/${video.id}`"
      />
    </div>
  </section>
</template>
