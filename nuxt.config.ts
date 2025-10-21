import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    siteConfigId: process.env.SITE_CONFIG_ID || '',
    public: {
      siteConfigId: process.env.SITE_CONFIG_ID || ''
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  routeRules: {
    '/api/**': {
      swr: 300,
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=86400'
      }
    }
  },
  nitro: {
    preset: process.env.NITRO_PRESET
  },
  app: {
    head: {
      titleTemplate: (titleChunk?: string) =>
        titleChunk ? `${titleChunk} · CHEK+` : 'CHEK+ Streaming',
      meta: [{ name: 'description', content: 'CHEK+ streaming built with Nuxt 3 and JWPlayer' }],
      link: [
        { rel: 'preconnect', href: 'https://cdn.jwplayer.com' },
        { rel: 'dns-prefetch', href: 'https://cdn.jwplayer.com' }
      ]
    }
  }
})
