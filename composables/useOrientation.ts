import { ref, computed, onMounted, onUnmounted } from 'vue'

export type Orientation = 'portrait' | 'landscape'

const orientation = ref<Orientation>('portrait')
let mq: MediaQueryList | null = null

function applyFromUrl() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const o = params.get('orient') as Orientation | null
  if (o === 'portrait' || o === 'landscape') {
    orientation.value = o
    return true
  }
  return false
}

function applyFromMedia() {
  // Only used if no ?orient=... override
  if (typeof window === 'undefined') return
  const isPortrait = window.matchMedia('(orientation: portrait)').matches
  orientation.value = isPortrait ? 'portrait' : 'landscape'
}

if (typeof window !== 'undefined') {
  if (!applyFromUrl()) applyFromMedia()
}

function onMqChange(e: MediaQueryListEvent) {
  if (new URLSearchParams(window.location.search).get('orient')) return
  orientation.value = e.matches ? 'portrait' : 'landscape'
}

export function useOrientation() {
  onMounted(() => {
    if (!mq) {
      mq = window.matchMedia('(orientation: portrait)')
      mq.addEventListener('change', onMqChange)
    }
  })
  onUnmounted(() => {
    if (mq) {
      mq.removeEventListener('change', onMqChange)
      mq = null
    }
  })

  const isPortrait = computed(() => orientation.value === 'portrait')
  const isLandscape = computed(() => orientation.value === 'landscape')

  return { orientation, isPortrait, isLandscape }
}
