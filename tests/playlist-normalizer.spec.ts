import { describe, expect, it } from 'vitest'
import { normalizePlaylist, normalizePlaylistItem } from '~/server/utils/normalize'
import type { JwPlaylistItem } from '~/types/jw'

const sampleItem: JwPlaylistItem = {
  mediaid: 'abc123',
  title: 'Sample Video',
  description: 'A test video',
  image: 'https://cdn.jwplayer.com/poster.jpg',
  tags: 'News,Feature',
  duration: 120,
  sources: [
    { file: 'https://cdn.jwplayer.com/videos/abc123.mp4', type: 'video/mp4', label: '720' },
    { file: 'https://cdn.jwplayer.com/manifests/abc123.m3u8', type: 'application/vnd.apple.mpegurl' }
  ],
  tracks: [{ file: 'https://cdn.jwplayer.com/tracks/abc123.vtt', kind: 'captions', label: 'English' }]
}

describe('normalizePlaylist', () => {
  it('normalizes a single playlist item', () => {
    const normalized = normalizePlaylistItem(sampleItem, 'playlist-1')
    expect(normalized.id).toBe('abc123')
    expect(normalized.hls).toContain('.m3u8')
    expect(normalized.mp4).toContain('.mp4')
    expect(normalized.captions).toHaveLength(1)
    expect(normalized.tags).toEqual(['News', 'Feature'])
    expect(normalized.playlistId).toBe('playlist-1')
  })

  it('normalizes arrays of playlist items', () => {
    const normalized = normalizePlaylist([sampleItem], 'playlist-1')
    expect(normalized).toHaveLength(1)
    expect(normalized[0].title).toBe('Sample Video')
  })
})
