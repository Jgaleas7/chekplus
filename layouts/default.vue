<script setup lang="ts">
import { computed } from 'vue'
import QuasarBrand from '~/components/QuasarBrand.vue'
import { useJW } from '~/composables/useJW'
import { useTheme } from '~/composables/useTheme'

const { fetchConfig } = useJW()
const { data: config } = await useAsyncData('site-config', fetchConfig)
const theme = useTheme()

const menuItems = computed(() =>
  (config.value?.menu ?? []).filter((item) => item.type === 'playlist')
)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <QuasarBrand />
        <nav class="hidden gap-6 text-sm font-semibold text-slate-600 md:flex dark:text-slate-300">
          <NuxtLink to="/" class="hover:text-brand" prefetch>Home</NuxtLink>
          <NuxtLink to="/search" class="hover:text-brand" prefetch>Search</NuxtLink>
          <NuxtLink to="/favorites" class="hover:text-brand" prefetch>Favorites</NuxtLink>
          <NuxtLink
            v-for="item in menuItems"
            :key="item.contentId"
            :to="`/playlist/${item.contentId}`"
            class="hover:text-brand"
            prefetch
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-3">
          <button
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            type="button"
            @click="theme.toggle"
          >
            <span v-if="theme.isDark">🌙</span>
            <span v-else>☀️</span>
          </button>
          <NuxtLink
            to="/favorites"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Favorites"
            prefetch
          >
            ★
          </NuxtLink>
          <NuxtLink
            to="/search"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 md:hidden"
            aria-label="Search"
            prefetch
          >
            🔍
          </NuxtLink>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-slate-200 bg-white/70 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
      Built with Nuxt 3, JWPlayer APIs, and Mux Player.
    </footer>
  </div>
</template>
