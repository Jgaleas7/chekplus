<script setup lang="ts">
import { computed } from 'vue'
import type { UiVideo } from '~/types/jw'
import { useVideoStore } from '~/stores/videos'
import { useMuxPlayer } from '~/composables/useMuxPlayer'

const props = defineProps<{
  video: UiVideo
  to: string
  showFavoriteToggle?: boolean
}>()

const store = useVideoStore()
const { ensureLoaded } = useMuxPlayer()

const isFavorite = computed(() => store.isFavorite(props.video.id))

function handlePrefetch() {
  void ensureLoaded()
}

function toggleFavorite(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  store.toggleFavorite(props.video.id)
}
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900"
    @mouseenter="handlePrefetch"
    @focusin="handlePrefetch"
    prefetch
  >
    <div class="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-700">
      <img
        v-if="video.poster"
        :src="video.poster"
        :alt="video.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-slate-500">No image</div>
      <span
        v-if="video.contentType === 'series'"
        class="absolute left-3 top-3 rounded-full bg-brand/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
      >
        Series
      </span>
      <button
        v-if="showFavoriteToggle !== false"
        class="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/80"
        type="button"
        :aria-pressed="isFavorite"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        @click="toggleFavorite"
      >
        <span v-if="isFavorite">★</span>
        <span v-else>☆</span>
      </button>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-4">
      <h3 class="line-clamp-2 text-lg font-semibold text-slate-900 transition group-hover:text-brand dark:text-white">
        {{ video.title }}
      </h3>
      <p v-if="video.description" class="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
        {{ video.description }}
      </p>
    </div>
  </NuxtLink>
</template>
