import { createError, defineEventHandler, getRouterParam, setHeader } from 'h3'
import { normalizePlaylist } from '~/server/utils/normalize'
import type { PlaylistResponse } from '~/types/jw'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Playlist id is required' })
  }

  const response = await $fetch<PlaylistResponse>(
    `https://cdn.jwplayer.com/v2/playlists/${id}?format=json&page_offset=1&page_limit=500`
  )

  const videos = normalizePlaylist(response.playlist, id)

  setHeader(event, 'Cache-Control', 's-maxage=300, stale-while-revalidate=86400')

  return {
    id,
    title: response.title,
    description: response.description,
    videos
  }
})
