import type { JwPlaylistItem, MediaResponse, UiVideo } from '~/types/jw'

const PLACEHOLDER_POSTER = 'https://dummyimage.com/1280x720/0f172a/ffffff&text=CHEK+'

function pickBestMp4(sources: JwPlaylistItem['sources'] = []) {
  const mp4s = sources.filter((source) => source.type?.includes('mp4'))
  if (!mp4s.length) {
    return undefined
  }
  const sorted = mp4s
    .map((source) => ({
      ...source,
      quality: Number.parseInt(source.label ?? '', 10) || 0
    }))
    .sort((a, b) => b.quality - a.quality)
  return sorted[0]?.file
}

function pickHls(sources: JwPlaylistItem['sources'] = []) {
  return sources.find((source) => source.type?.includes('mpegurl'))?.file
}

function extractCaptions(tracks: JwPlaylistItem['tracks'] = []) {
  return tracks
    .filter((track) => track.kind === 'captions' && Boolean(track.file))
    .map((track) => ({
      src: track.file,
      label: track.label
    }))
}

function extractTags(tags?: string) {
  return tags
    ?.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function normalizePlaylistItem(item: JwPlaylistItem, playlistId?: string): UiVideo {
  return {
    id: item.mediaid,
    title: item.title,
    description: item.description,
    poster: item.image || PLACEHOLDER_POSTER,
    hls: pickHls(item.sources),
    mp4: pickBestMp4(item.sources),
    captions: extractCaptions(item.tracks),
    duration: item.duration,
    tags: extractTags(item.tags),
    playlistId: item.playlistId ?? playlistId,
    seriesId: item.seriesId,
    contentType: item.contentType
  }
}

export function normalizePlaylist(items: JwPlaylistItem[] = [], playlistId?: string) {
  return items.map((item) => normalizePlaylistItem(item, playlistId))
}

export function normalizeMedia(media: MediaResponse, fallbackPlaylistId?: string): UiVideo {
  const directSources = media.sources ?? media.playlist?.[0]?.sources
  const directTracks = media.tracks ?? media.playlist?.[0]?.tracks
  const poster = media.images?.sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.src
  const tags = media.tags ?? media.playlist?.[0]?.tags

  return {
    id: media.id,
    title: media.title,
    description: media.description ?? media.playlist?.[0]?.description,
    poster: poster || media.playlist?.[0]?.image || PLACEHOLDER_POSTER,
    hls: pickHls(directSources),
    mp4: pickBestMp4(directSources),
    captions: extractCaptions(directTracks),
    duration: media.duration ?? media.playlist?.[0]?.duration,
    tags: extractTags(tags),
    playlistId: fallbackPlaylistId ?? media.playlist?.[0]?.playlistId,
    contentType: media.playlist?.[0]?.contentType,
    seriesId: media.playlist?.[0]?.seriesId
  }
}
