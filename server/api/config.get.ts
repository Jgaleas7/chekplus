import { createError, defineEventHandler, setHeader } from 'h3'
import type { SiteConfig } from '~/types/jw'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteConfigId = config.siteConfigId || config.public.siteConfigId

  if (!siteConfigId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'SITE_CONFIG_ID is not configured'
    })
  }

  const response = await $fetch<SiteConfig>(
    `https://cdn.jwplayer.com/apps/configs/${siteConfigId}.json`
  )

  setHeader(event, 'Cache-Control', 's-maxage=300, stale-while-revalidate=86400')

  return response
})
