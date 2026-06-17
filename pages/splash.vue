<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

definePageMeta({ layout: 'splash' })

const props = defineProps<{
  autostartDelay?: number
}>()

// Default: 4s. Can be overridden by ?delay=2 in URL (testing).
const delay = computed(() => props.autostartDelay ?? 4000)
const remaining = ref(delay.value)
const progress = ref(0) // 0 → 1
let interval: ReturnType<typeof setInterval> | null = null

function go() {
  // Use the Nuxt router to swap to the home route without a hard reload.
  // window.location.href = '/' would also work, but a SPA transition is smoother.
  const router = useRouter()
  router.push('/')
}

function tick() {
  if (remaining.value <= 0) {
    stop()
    go()
    return
  }
  remaining.value -= 100
  progress.value = 1 - remaining.value / delay.value
}

function stop() {
  if (interval) { clearInterval(interval); interval = null }
}

function skip() {
  stop()
  go()
}

onMounted(() => {
  // Allow ?delay=N (ms) for testing
  const params = new URLSearchParams(window.location.search)
  const override = parseInt(params.get('delay') || '', 10)
  if (!Number.isNaN(override) && override > 0) {
    remaining.value = override
  }
  interval = setInterval(tick, 100)
})
onUnmounted(stop)
</script>

<template>
  <div class="splash" @pointerdown="skip">
    <!-- Background photo. -->
    <div class="bg">
      <div class="bg-img" :style="{ backgroundImage: `url(/images/250828 Convocation Chapel Edited-3974.jpg)` }" />
      <div class="bg-veil" />
    </div>

    <!-- Top brand -->
    <div class="brand">
      <img
        class="brand-shield"
        src="/images/northwest_shield.png"
        alt="Northwest University shield"
        width="96"
        height="101"
      />
      <div class="brand-text">
        <div class="brand-name">Northwest University</div>
        <div class="brand-sub">Interactive Display</div>
      </div>
    </div>

    <!-- Centerpiece -->
    <div class="center">
      <div class="eyebrow">Welcome to Northwest</div>
      <h1 class="display-1">Follow Your Faith.<br/><span class="italic">Find Your Future.</span></h1>
      <p class="lede">A Christ-centered university in Kirkland, Washington, since 1934.</p>
    </div>

    <!-- Bottom: progress + CTA -->
    <div class="foot">
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${progress * 100}%` }" />
      </div>
      <div class="foot-row">
        <div class="foot-hint">Tap anywhere to begin</div>
        <button class="btn btn-primary go-btn" @click.stop="skip">
          Begin <span class="go-arrow">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.splash {
  position: absolute; inset: 0;
  width: 1080px;
  height: 1920px;
  overflow: hidden;
  background: var(--nu-midnight);
  cursor: pointer;
  z-index: 1;
}
/* Reset the splash-shell's overflow: hidden with our own (the shell already
   clips correctly, we just want a stacking context for the bg). */

.bg { position: absolute; inset: 0; }
.bg-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  animation: kenburns 18s ease-in-out infinite alternate;
}
.bg-veil {
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, rgba(0,38,61,0.7) 0%, rgba(0,38,61,0.25) 40%, rgba(0,38,61,0.25) 60%, rgba(0,38,61,0.85) 100%);
}

.brand {
  position: absolute;
  top: 80px; left: 80px;
  display: flex; align-items: center; gap: 24px;
  color: var(--nu-wisp);
  z-index: 2;
  animation: fadeRight 0.8s var(--ease-out-soft) both;
}
.brand-shield {
  width: 96px;
  height: 101px;
  object-fit: contain;
  filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.28));
}
.brand-name {
  font-family: var(--font-serif);
  font-size: 36px; line-height: 1.1;
}
.brand-sub {
  font-size: 16px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  opacity: 0.85;
  margin-top: 4px;
}

.center {
  position: absolute;
  left: 80px; right: 80px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--nu-wisp);
  text-align: center;
  z-index: 2;
}
.center .eyebrow {
  color: var(--nu-tour);
  font-size: 24px;
  margin-bottom: 32px;
  animation: fadeUp 0.9s var(--ease-out-soft) 0.1s both;
}
.center .display-1 {
  color: var(--nu-wisp);
  font-size: 96px;
  line-height: 1.0;
  margin-bottom: 28px;
  animation: fadeUp 1s var(--ease-out-soft) 0.25s both;
}
.center .display-1 span { color: var(--nu-tour); }
.center .lede {
  margin: 0 auto;
  color: var(--nu-skylight);
  font-size: 32px;
  max-width: 24ch;
  animation: fadeUp 1s var(--ease-out-soft) 0.4s both;
}

.foot {
  position: absolute;
  left: 80px; right: 80px;
  bottom: 130px;
  z-index: 2;
  animation: fadeUp 1s var(--ease-out-soft) 0.6s both;
}

.progress {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 32px;
}
.progress-bar {
  height: 100%;
  background: var(--nu-tour);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.foot-row {
  display: flex; align-items: center; justify-content: space-between;
}
.foot-hint {
  font-size: 20px;
  color: var(--nu-skylight);
  letter-spacing: 0.04em;
}
.go-btn {
  font-size: 24px;
  font-weight: 700;
  padding: 0 40px;
  min-height: 80px;
  min-width: 240px;
}
.go-arrow {
  margin-left: 12px;
  font-size: 28px;
  transition: transform 0.25s var(--ease-out-soft);
}
.go-btn:hover .go-arrow { transform: translateX(6px); }
</style>
