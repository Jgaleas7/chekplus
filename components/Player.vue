<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import type { UiVideo } from '~/types/jw'
import { useMuxPlayer } from '~/composables/useMuxPlayer'

const props = defineProps<{
  video: UiVideo
}>()

const { ensureLoaded } = useMuxPlayer()

const source = computed(() => props.video.hls || props.video.mp4)

onMounted(() => {
  void ensureLoaded()
})

watch(
  () => props.video.id,
  () => {
    if (import.meta.client) {
      void ensureLoaded()
    }
  }
)
</script>

<template>
  <ClientOnly>
    <template #fallback>
      <div class="aspect-video w-full rounded-2xl bg-slate-200 animate-pulse dark:bg-slate-800" />
    </template>
    <mux-player
      v-if="source"
      class="aspect-video w-full overflow-hidden rounded-2xl"
      :title="video.title"
      :poster="video.poster"
      :src="source"
      stream-type="on-demand"
      playsinline
      primary-color="#00B4FF"
      accent-color="#00B4FF"
    >
      <track
        v-for="caption in video.captions"
        :key="caption.src"
        slot="tracks"
        kind="subtitles"
        :src="caption.src"
        :label="caption.label"
        default
      />
    </mux-player>
    <div v-else class="aspect-video w-full rounded-2xl border border-dashed border-slate-400 p-6 text-center">
      <p class="text-lg font-semibold text-slate-600 dark:text-slate-300">This video is not yet available for streaming.</p>
    </div>
  </ClientOnly>
</template>
