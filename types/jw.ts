export interface JwPlaylistItem {
  mediaid: string
  title: string
  description?: string
  image?: string
  tags?: string
  duration?: number
  seriesId?: string
  contentType?: string
  playlistId?: string
  sources?: Array<{
    file: string
    type: string
    label?: string
  }>
  tracks?: Array<{
    file: string
    kind: string
    label?: string
  }>
}

export interface UiVideo {
  id: string
  title: string
  description?: string
  poster?: string
  hls?: string
  mp4?: string
  captions?: Array<{
    src: string
    label?: string
  }>
  duration?: number
  tags?: string[]
  playlistId?: string
  seriesId?: string
  contentType?: string
}

export interface SiteConfig {
  siteId: string
  content: Array<{
    type: string
    contentId: string
    title?: string
  }>
  menu: Array<{
    type: string
    contentId: string
    label?: string
  }>
  features?: Record<string, string>
}

export interface PlaylistResponse {
  title: string
  description?: string
  playlist: JwPlaylistItem[]
  feedid?: string
}

export interface MediaResponse {
  id: string
  title: string
  description?: string
  images?: Array<{ src: string; width?: number }>
  playlist?: JwPlaylistItem[]
  duration?: number
  tags?: string
  sources?: JwPlaylistItem['sources']
  tracks?: JwPlaylistItem['tracks']
}
