import { ref, onMounted, onUnmounted } from 'vue'

interface SwipeOptions {
  threshold?: number   // px in X to commit a swipe
  restraint?: number   // vertical tolerance
  allowedTime?: number // max ms for a swipe
  onLeft?:  () => void
  onRight?: () => void
  onUp?:    () => void
  onDown?:  () => void
  enabled?: () => boolean
}

export function useSwipe(opts: SwipeOptions) {
  const {
    threshold = 80,
    restraint = 80,
    allowedTime = 800,
    enabled = () => true
  } = opts

  let startX = 0, startY = 0, startT = 0
  let tracking = false

  function down(e: PointerEvent) {
    if (!enabled()) return
    tracking = true
    startX = e.clientX
    startY = e.clientY
    startT = Date.now()
  }
  function up(e: PointerEvent) {
    if (!tracking || !enabled()) { tracking = false; return }
    tracking = false
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const dt = Date.now() - startT
    if (dt > allowedTime) return
    if (Math.abs(dx) >= threshold && Math.abs(dy) <= restraint) {
      if (dx < 0) opts.onLeft?.()
      else        opts.onRight?.()
    } else if (Math.abs(dy) >= threshold && Math.abs(dx) <= restraint) {
      if (dy < 0) opts.onUp?.()
      else        opts.onDown?.()
    }
  }

  onMounted(() => {
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup',   up,   { passive: true })
  })
  onUnmounted(() => {
    window.removeEventListener('pointerdown', down)
    window.removeEventListener('pointerup',   up)
  })
}
