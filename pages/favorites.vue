<script setup lang="ts">
import { storeToRefs } from 'pinia'
import VideoCard from '~/components/VideoCard.vue'
import { useVideoStore } from '~/stores/videos'

const store = useVideoStore()
const { favoriteVideos } = storeToRefs(store)

useHead({
  title: 'Favorites'
})
</script>

<template>
  <section class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Favorites</h1>
      <p class="text-slate-600 dark:text-slate-300">Saved videos are stored locally on this device.</p>
    </div>

    <div v-if="!favoriteVideos.length" class="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
      You have not added any favorites yet.
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <VideoCard
        v-for="video in favoriteVideos"
        :key="video.id"
        :video="video"
        :to="video.hls || video.mp4 ? `/video/${video.id}${video.playlistId ? `?playlistId=${video.playlistId}` : ''}` : `/series/${video.id}`"
      />
    </div>
  </section>
</template>
