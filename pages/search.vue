<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import VideoCard from '~/components/VideoCard.vue'
import { useJW } from '~/composables/useJW'
import { useVideoStore } from '~/stores/videos'

const route = useRoute()
const router = useRouter()
const store = useVideoStore()
const { fetchConfig } = useJW()

const { data: config } = await useAsyncData('site-config', fetchConfig)

const loadingPlaylists = reactive(new Set<string>())

async function warmShelves() {
  if (!config.value) return
  await Promise.all(
    config.value.content
      .filter((entry) => entry.type === 'playlist')
      .map(async (entry) => {
        if (loadingPlaylists.has(entry.contentId)) return
        loadingPlaylists.add(entry.contentId)
        await store.ensurePlaylist(entry.contentId)
      })
  )
}

await warmShelves()

const searchQuery = ref<string>((route.query.q as string) ?? '')

watch(searchQuery, (value) => {
  router.replace({ path: '/search', query: value ? { q: value } : undefined })
})

const results = computed(() => store.searchVideos(searchQuery.value))

useHead({
  title: 'Search'
})
</script>

<template>
  <section class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
    <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Search the library</h1>
    <form class="flex flex-col gap-4" @submit.prevent>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search titles, descriptions, or tags"
        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 shadow-sm transition focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      />
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Results are powered by cached playlists for instant feedback.
      </p>
    </form>

    <div v-if="searchQuery && !results.length" class="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
      No videos found for "{{ searchQuery }}".
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <VideoCard
        v-for="video in results"
        :key="video.id"
        :video="video"
        :to="video.hls || video.mp4 ? `/video/${video.id}${video.playlistId ? `?playlistId=${video.playlistId}` : ''}` : `/series/${video.id}`"
      />
    </div>
  </section>
</template>
