import { ref, computed } from 'vue'
import type { WorldKey } from '~/types'

export type LocationKey = 'student-center' | 'athletics' | 'library' | 'residence' | 'default' | 'main-lobby'

const LOCATION_LABELS: Record<LocationKey, string> = {
  'student-center': 'Student Center',
  'athletics':      'Athletics Lobby',
  'library':        'Library',
  'residence':      'Residence Hall',
  'default':        'Main Lobby',
  'main-lobby':     'Main Lobby'
}

const LOCATION_PRIORITY: Record<LocationKey, WorldKey[]> = {
  'student-center': ['life', 'events', 'home'],
  'athletics':      ['athletics', 'events', 'home'],
  'library':        ['academics', 'home'],
  'residence':      ['life', 'faith', 'events', 'home'],
  'default':        ['home', 'discover'],
  'main-lobby':     ['home', 'discover']
}

const location = ref<LocationKey>('default')

// Read ?loc=... on first load, fall back to 'default'.
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search)
  const l = params.get('loc') as LocationKey | null
  if (l && LOCATION_PRIORITY[l]) location.value = l
}

export function useLocation() {
  const label = computed(() => LOCATION_LABELS[location.value])
  const priority = computed(() => LOCATION_PRIORITY[location.value])
  function set(l: LocationKey) { location.value = l }
  return { location, label, priority, set }
}
