let muxLoader: Promise<void> | null = null

export function useMuxPlayer() {
  const ensureLoaded = () => {
    if (!import.meta.client) {
      return Promise.resolve()
    }
    if (!muxLoader) {
      muxLoader = new Promise((resolve, reject) => {
        if (customElements.get('mux-player')) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.type = 'module'
        script.src = 'https://unpkg.com/@mux/mux-player'
        script.addEventListener('load', () => resolve())
        script.addEventListener('error', (event) => reject(event))
        document.head.appendChild(script)
      })
    }
    return muxLoader
  }

  return {
    ensureLoaded
  }
}
