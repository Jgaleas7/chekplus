import { computed, watch } from 'vue'
import { useLocalStorage, usePreferredDark } from '@vueuse/core'

type ThemeMode = 'light' | 'dark'

export function useTheme() {
  const preferredDark = usePreferredDark()
  const mode = useLocalStorage<ThemeMode>('chekplus-theme', preferredDark.value ? 'dark' : 'light')

  const isDark = computed(() => mode.value === 'dark')

  if (import.meta.client) {
    watch(
      mode,
      (value) => {
        const root = document.documentElement
        root.classList.toggle('dark', value === 'dark')
        root.style.setProperty('color-scheme', value)
      },
      { immediate: true }
    )
  }

  const toggle = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    mode,
    isDark,
    toggle
  }
}
