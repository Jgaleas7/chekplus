import { createError, defineEventHandler, getQuery, getRouterParam, setHeader } from 'h3'
import { normalizeMedia } from '~/server/utils/normalize'
import type { MediaResponse } from '~/types/jw'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Media id is required' })
  }

  const query = getQuery(event)
  const playlistId = typeof query.playlistId === 'string' ? query.playlistId : undefined

  const response = await $fetch<MediaResponse>(`https://cdn.jwplayer.com/v2/media/${id}`)

  const video = normalizeMedia(response, playlistId)

  setHeader(event, 'Cache-Control', 's-maxage=300, stale-while-revalidate=86400')

  return video
})
