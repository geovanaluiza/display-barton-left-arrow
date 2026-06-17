<script setup lang="ts">
import { ref, computed } from 'vue'
import { EVENTS, whenLabel, inLabel } from '~/utils/content'
import type { EventItem } from '~/types'

// Augment the runtime type with `start` for sorting.
type WithStart = EventItem & { start?: string }

const cats = ['All', 'Chapel', 'Academic', 'Athletics', 'Arts', 'Social', 'Service'] as const
const active = ref<(typeof cats)[number]>('All')

const now = new Date()

// Sort: future events ascending, past events last.
const sorted = computed(() => {
  return [...(EVENTS as WithStart[])].sort((a, b) => {
    const ta = a.start ? new Date(a.start).getTime() : 0
    const tb = b.start ? new Date(b.start).getTime() : 0
    const aFuture = ta >= now.getTime()
    const bFuture = tb >= now.getTime()
    if (aFuture && !bFuture) return -1
    if (!aFuture && bFuture) return 1
    return ta - tb
  })
})

const filtered = computed(() =>
  active.value === 'All' ? sorted.value : sorted.value.filter(e => e.category === active.value.toLowerCase())
)
const upcoming = computed(() => filtered.value[0])
const rest = computed(() => filtered.value.slice(1))

function relativeFor(e: WithStart) {
  if (!e.start) return e.date
  return inLabel(e.start, now)
}
</script>

<template>
  <div class="world-body-inner">
    <WorldHeader
      eyebrow="Campus Events"
      title="What's Next at NU."
    />

    <div class="chips">
      <button
        v-for="c in cats"
        :key="c"
        class="chip"
        :class="{ 'is-active': active === c }"
        @click="active = c"
      >{{ c }}</button>
    </div>

    <!-- Up Next — featured -->
    <section v-if="upcoming" class="upnext">
      <div class="upnext-eyebrow">Up Next &middot; {{ relativeFor(upcoming) }}</div>
      <article class="upnext-card">
        <img v-if="upcoming.image" class="upnext-photo" :src="`/images/${upcoming.image}`" :alt="upcoming.title" />
        <div v-else class="upnext-photo upnext-photo--fallback" />
        <div class="upnext-veil" />
        <div class="upnext-body">
          <div class="upnext-time">
            <span class="upnext-when">{{ upcoming.start ? whenLabel(upcoming.start, now) : upcoming.date }}</span>
            <span class="upnext-hms">{{ upcoming.time }}</span>
          </div>
          <h2 class="upnext-title">{{ upcoming.title }}</h2>
          <div class="upnext-loc">{{ upcoming.location }}</div>
        </div>
      </article>
    </section>

    <!-- More events -->
    <h2 class="h2 sect" v-if="rest.length">More Ahead</h2>
    <div class="grid stagger">
      <article v-for="(e, i) in rest" :key="e.id" class="event hover-lift" :style="{ animationDelay: `${i * 50}ms` }">
        <img v-if="e.image" class="event-photo" :src="`/images/${e.image}`" :alt="e.title" />
        <div v-else class="event-photo event-photo--fallback" />
        <div class="event-overlay" />
        <div class="event-corner" v-if="whenLabel(e.start, now) === 'Today'">● LIVE</div>
        <div class="event-body">
          <div class="event-date">
            <span class="day">{{ e.start ? whenLabel(e.start, now) : e.date }}</span>
            <span class="time">{{ e.time }}</span>
          </div>
          <h3 class="card-title">{{ e.title }}</h3>
          <div class="card-meta">{{ e.location }}</div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.world-body-inner {
  position: absolute; inset: 0;
  padding: 48px 56px 64px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  min-height: 0;
}
.world-body-inner::-webkit-scrollbar { display: none; }
.world-body-inner > * { animation: fadeUp 0.7s var(--ease-out-soft) both; }

.chips { display: flex; flex-wrap: wrap; gap: 10px; margin: 24px 0 32px; }

/* === Up Next featured card === */
.upnext {
  margin-bottom: 40px;
}
.upnext-eyebrow {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--nu-tour);
  margin-bottom: 16px;
  animation: fadeUp 0.7s var(--ease-out-soft) 0.1s both;
}
.upnext-card {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  height: 420px;
  background: var(--nu-cloud);
  box-shadow: 0 12px 32px rgba(0, 38, 61, 0.12);
  animation: scaleIn 0.8s var(--ease-out-soft) 0.2s both;
}
.upnext-photo {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  display: block;
  transition: transform 1s var(--ease-out-soft);
}
.upnext-card:hover .upnext-photo { transform: scale(1.04); }
.upnext-photo--fallback { background: linear-gradient(135deg, var(--nu-blue), var(--nu-navy)); }
.upnext-veil {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0, 38, 61, 0.85) 0%, rgba(0, 38, 61, 0.4) 50%, rgba(0, 38, 61, 0.7) 100%);
}
.upnext-body {
  position: absolute; inset: 0;
  padding: 48px;
  color: var(--nu-wisp);
  display: flex; flex-direction: column;
  justify-content: flex-end;
  z-index: 1;
}
.upnext-time {
  display: flex; align-items: baseline; gap: 16px;
  margin-bottom: 14px;
}
.upnext-when {
  font-family: var(--font-serif);
  font-size: 44px; line-height: 1;
  color: var(--nu-tour);
  font-weight: 700;
}
.upnext-hms {
  font-size: 22px;
  color: var(--nu-skylight);
  font-weight: 600;
}
.upnext-title {
  font-family: var(--font-serif);
  font-size: 56px; line-height: 1.05;
  color: var(--nu-wisp);
  margin: 0 0 12px;
  letter-spacing: -0.01em;
}
.upnext-loc {
  font-size: 18px;
  color: var(--nu-skylight);
  margin-bottom: 14px;
  font-weight: 600;
}
.upnext-blurb {
  font-size: 18px;
  line-height: 1.45;
  color: var(--nu-wisp);
  max-width: 60ch;
  opacity: 0.9;
}

/* === Also-this-week grid === */
.sect { margin: 8px 0 20px; }
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.event {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  height: 380px;
  background: var(--nu-cloud);
  box-shadow: 0 6px 20px rgba(0, 38, 61, 0.08);
}
.event-photo {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  display: block;
  transition: transform 0.8s var(--ease-out-soft);
}
.event:hover .event-photo { transform: scale(1.05); }
.event-corner {
  position: absolute;
  top: 16px; right: 16px;
  padding: 4px 12px;
  background: var(--nu-tour);
  color: var(--nu-midnight);
  border-radius: 999px;
  font-size: 11px; font-weight: 800;
  letter-spacing: 0.12em;
  z-index: 3;
  animation: pulse 1.6s ease-in-out infinite;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
.event-photo--fallback { background: linear-gradient(135deg, var(--nu-blue), var(--nu-navy)); }
.event-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0, 38, 61, 0) 25%, rgba(0, 38, 61, 0.95) 100%);
}
.event-body {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 28px;
  color: var(--nu-wisp);
  display: flex; flex-direction: column;
  gap: 6px;
}
.event-date { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.day { font-family: var(--font-serif); font-size: 22px; color: var(--nu-tour); font-weight: 700; }
.time { font-size: 16px; color: var(--nu-skylight); }
.event .card-title { font-size: 26px; }
.event .card-meta { color: var(--nu-skylight); font-size: 15px; }
</style>
