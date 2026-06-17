<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BUILDINGS, getDirections, type Building } from '~/utils/directions'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

// Categories for grouping in the picker
const categories: { key: Building['category']; label: string }[] = [
  { key: 'admin',    label: 'Administrative' },
  { key: 'academic', label: 'Academic' },
  { key: 'chapel',   label: 'Chapel' },
  { key: 'dining',   label: 'Dining' },
  { key: 'housing',  label: 'Residence Halls' },
  { key: 'library',  label: 'Library' },
  { key: 'athletics',label: 'Athletics' }
]

const groups = computed(() =>
  categories.map(c => ({
    key: c.key,
    label: c.label,
    items: BUILDINGS.filter(b => b.category === c.key)
  })).filter(g => g.items.length)
)

const fromId = ref('barton')
const toId   = ref('hsc')

watch(() => props.open, (v) => {
  if (v) {
    // Default: from Barton to a sensible destination
    fromId.value = 'barton'
    toId.value   = 'hsc'
  }
})

const fromBuilding = computed(() => BUILDINGS.find(b => b.id === fromId.value)!)
const toBuilding   = computed(() => BUILDINGS.find(b => b.id === toId.value)!)
const directions   = computed(() => getDirections(fromId.value, toId.value))

function swap() {
  const a = fromId.value
  fromId.value = toId.value
  toId.value = a
}

function close() { emit('close') }
</script>

<template>
  <transition name="directions">
    <div v-if="open" class="dir-root" @click.self="close">
      <aside class="dir-panel" role="dialog" aria-label="Campus directions">
        <header class="dir-head">
          <div>
            <div class="eyebrow">Wayfinding</div>
            <h2 class="h2">Get Directions</h2>
          </div>
          <button class="close-btn" aria-label="Close" @click="close">×</button>
        </header>

        <!-- Picker: From + To -->
        <div class="picker">
          <div class="picker-side">
            <div class="picker-label">From</div>
            <select v-model="fromId" class="picker-select">
              <optgroup v-for="g in groups" :key="`f-${g.key}`" :label="g.label">
                <option v-for="b in g.items" :key="`f-${b.id}`" :value="b.id">
                  {{ b.name }} ({{ b.number }})
                </option>
              </optgroup>
            </select>
            <div class="picker-blurb">{{ fromBuilding.blurb }}</div>
          </div>

          <button class="swap-btn" aria-label="Swap" @click="swap">↕</button>

          <div class="picker-side">
            <div class="picker-label">To</div>
            <select v-model="toId" class="picker-select">
              <optgroup v-for="g in groups" :key="`t-${g.key}`" :label="g.label">
                <option v-for="b in g.items" :key="`t-${b.id}`" :value="b.id">
                  {{ b.name }} ({{ b.number }})
                </option>
              </optgroup>
            </select>
            <div class="picker-blurb">{{ toBuilding.blurb }}</div>
          </div>
        </div>

        <!-- Quick chips for popular destinations from Barton -->
        <div class="quick-row">
          <div class="quick-label">Popular from {{ fromBuilding.name }}:</div>
          <div class="quick-chips">
            <button
              v-for="b in ['hsc','chapel','caf','library','pecota','gray','crowder','pavilion']"
              :key="b"
              class="quick-chip"
              :class="{ 'is-active': b === toId }"
              @click="toId = b"
            >
              {{ BUILDINGS.find(x => x.id === b)?.name }}
            </button>
          </div>
        </div>

        <!-- Directions result -->
        <div v-if="fromBuilding.id === toBuilding.id" class="result-block is-info">
          <div class="result-msg">You\u2019re already at {{ fromBuilding.name }}. Pick a destination to get directions.</div>
        </div>

        <div v-else-if="directions" class="result-block">
          <div class="result-head">
            <div>
              <div class="result-route">
                <span class="route-from">{{ directions.from }}</span>
                <span class="route-arrow">→</span>
                <span class="route-to">{{ directions.to }}</span>
              </div>
              <div class="result-meta">
                <span>~{{ directions.totalMin }} min</span>
                <span class="dot-sep" />
                <span>~{{ directions.distanceM }} m</span>
                <span class="dot-sep" />
                <span>Walk</span>
              </div>
            </div>
            <div class="result-tag">Building {{ toBuilding.number }}</div>
          </div>

          <ol class="step-list">
            <li v-for="(s, i) in directions.steps" :key="i" class="step" :style="{ animationDelay: `${100 + i * 80}ms` }">
              <div class="step-num">{{ i + 1 }}</div>
              <div class="step-body">
                <div class="step-text">{{ s.text }}</div>
                <div v-if="s.hint" class="step-hint">— {{ s.hint }}</div>
              </div>
            </li>
          </ol>

          <div class="result-foot">
            <strong>Tip:</strong> the Barton Loop is a one-way drive; the main entrance to Barton Building faces the loop on the south side of campus.
          </div>
        </div>
      </aside>
    </div>
  </transition>
</template>

<style scoped>
.dir-root {
  position: absolute; inset: 0;
  z-index: 45;
  background: rgba(0, 38, 61, 0.45);
  backdrop-filter: blur(6px);
  display: flex; justify-content: flex-end;
}
.dir-panel {
  position: relative;
  width: 980px;
  max-width: 95%;
  height: 100%;
  background: var(--nu-wisp);
  display: flex; flex-direction: column;
  padding: 56px 64px 56px;
  overflow-y: auto;
  scrollbar-width: none;
  box-shadow: -8px 0 40px rgba(0, 38, 61, 0.25);
  animation: slideInRight 0.45s var(--ease-out-soft) both;
}
.dir-panel::-webkit-scrollbar { display: none; }

.dir-head {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 32px;
}
.dir-head .eyebrow {
  color: var(--nu-blue);
  margin-bottom: 12px;
  font-size: 18px;
}
.dir-head h2 { letter-spacing: -0.01em; }
.close-btn {
  width: 76px; height: 76px;
  border-radius: 50%;
  background: var(--nu-powder);
  border: 1px solid var(--nu-sky);
  font-size: 40px; line-height: 1;
  color: var(--nu-midnight);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.close-btn:hover { background: var(--nu-skylight); }
.close-btn:active { transform: scale(0.92); }

/* Picker */
.picker {
  display: grid;
  grid-template-columns: 1fr 64px 1fr;
  gap: 18px;
  align-items: stretch;
  background: var(--nu-powder);
  padding: 24px;
  border-radius: 22px;
  margin-bottom: 24px;
}
.picker-side { display: flex; flex-direction: column; gap: 10px; }
.picker-label {
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--nu-blue);
}
.picker-select {
  width: 100%;
  padding: 18px 20px;
  font-family: var(--font-serif);
  font-size: 22px;
  color: var(--nu-midnight);
  background: var(--nu-wisp);
  border: 2px solid var(--nu-sky);
  border-radius: 16px;
  appearance: none;
  cursor: pointer;
  min-height: 72px;
}
.picker-select:focus { outline: none; border-color: var(--nu-blue); }
.picker-blurb { font-size: 14px; color: var(--nu-navy); opacity: 0.8; }
.swap-btn {
  align-self: center;
  width: 56px; height: 56px;
  border-radius: 50%;
  background: var(--nu-tour);
  color: var(--nu-midnight);
  border: none;
  font-size: 24px; font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  transition: transform 0.25s var(--ease-out-soft);
}
.swap-btn:hover { transform: rotate(180deg); }
.swap-btn:active { transform: rotate(180deg) scale(0.95); }

/* Quick chips */
.quick-row { margin-bottom: 28px; }
.quick-label {
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--nu-navy);
  opacity: 0.8;
  margin-bottom: 10px;
}
.quick-chips { display: flex; flex-wrap: wrap; gap: 10px; }
.quick-chip {
  padding: 14px 22px;
  background: var(--nu-cloud);
  border: 1px solid var(--nu-sky);
  border-radius: 999px;
  color: var(--nu-navy);
  font-size: 15px; font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.quick-chip:hover { background: var(--nu-skylight); }
.quick-chip.is-active { background: var(--nu-navy); color: var(--nu-wisp); border-color: var(--nu-navy); }

/* Result */
.result-block {
  background: var(--nu-wisp);
  border: 1px solid var(--nu-sky);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 6px 20px rgba(0, 38, 61, 0.06);
  animation: fadeUp 0.5s var(--ease-out-soft) both;
}
.result-block.is-info {
  background: var(--nu-powder);
  text-align: center;
  font-family: var(--font-serif);
  font-size: 22px;
  color: var(--nu-navy);
  padding: 56px 32px;
}
.result-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--nu-cloud);
}
.result-route {
  display: flex; align-items: baseline; gap: 16px;
  font-family: var(--font-serif);
  font-size: 32px;
  color: var(--nu-midnight);
  margin-bottom: 8px;
}
.route-from { color: var(--nu-navy); }
.route-arrow { color: var(--nu-blue); font-size: 26px; }
.route-to { color: var(--nu-blue); font-weight: 700; }
.result-meta {
  display: flex; align-items: center; gap: 12px;
  font-size: 14px; font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--nu-navy);
}
.result-tag {
  padding: 12px 22px;
  background: var(--nu-navy);
  color: var(--nu-tour);
  border-radius: 999px;
  font-size: 16px; font-weight: 700;
  letter-spacing: 0.04em;
}

.step-list {
  list-style: none;
  margin: 0; padding: 0;
  display: flex; flex-direction: column;
  gap: 18px;
}
.step {
  display: flex; gap: 20px;
  animation: fadeUp 0.5s var(--ease-out-soft) both;
}
.step-num {
  flex: 0 0 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--nu-blue);
  color: var(--nu-wisp);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-serif);
  font-size: 20px; font-weight: 700;
}
.step-body { flex: 1; padding-top: 6px; }
.step-text {
  font-size: 18px; line-height: 1.45;
  color: var(--nu-midnight);
}
.step-hint {
  margin-top: 4px;
  font-size: 14px; font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--nu-blue);
}

.result-foot {
  margin-top: 24px;
  padding: 16px 20px;
  background: var(--nu-cloud);
  border-radius: 14px;
  font-size: 14px;
  color: var(--nu-navy);
  line-height: 1.4;
}
.dot-sep {
  display: inline-block;
  width: 5px; height: 5px;
  background: var(--nu-sky);
  border-radius: 999px;
}

@keyframes slideInRight {
  from { transform: translateX(40px); opacity: 0; }
  to   { transform: none; opacity: 1; }
}
.directions-enter-active, .directions-leave-active { transition: opacity 0.3s; }
.directions-enter-from, .directions-leave-to { opacity: 0; }
.directions-enter-from .dir-panel, .directions-leave-to .dir-panel { transform: translateX(40px); }
</style>
