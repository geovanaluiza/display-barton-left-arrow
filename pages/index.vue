<script setup lang="ts">
import { useDisplayState } from '~/composables/useDisplayState'
import { useLocation } from '~/composables/useLocation'
import { EVENTS, whenLabel, inLabel } from '~/utils/content'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { go } = useDisplayState()
const { label } = useLocation()
const router = useRouter()

// === HERO STATS (animated count-up) ===
const stats = [
  { value: 1934, label: 'Founded' },
  { value: 56,   label: 'Acres on the Lake' },
  { value: 22,   label: 'Undergraduate Majors' },
  { value: 9,    label: 'Eagles Teams' }
]
const displayed = ref(stats.map(() => 0))
const heroVisible = ref(false)
let rafId: number | null = null

function animateCountUp() {
  const start = performance.now()
  const dur = 1400
  function frame(t: number) {
    const p = Math.min(1, (t - start) / dur)
    // ease-out cubic
    const eased = 1 - Math.pow(1 - p, 3)
    displayed.value = stats.map(s => Math.round(s.value * eased))
    if (p < 1) rafId = requestAnimationFrame(frame)
  }
  rafId = requestAnimationFrame(frame)
}

onMounted(() => {
  heroVisible.value = true
  setTimeout(animateCountUp, 300)
})
onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })

const heroPhoto = 'WW_2025_Day1-3907.jpg'

// === MAP building pins (clickable) ===
const mapPins = [
  { key: 'barton',  label: '17', name: 'Barton',         x: 78, y: 78, color: 'var(--nu-navy)' },
  { key: 'hsc',     label: '18', name: 'HSC',            x: 55, y: 56, color: 'var(--nu-blue)' },
  { key: 'chapel',  label: '14', name: 'Chapel',         x: 51, y: 80, color: 'var(--nu-navy)' },
  { key: 'library', label: '9',  name: 'Library',        x: 48, y: 70, color: 'var(--nu-blue)' },
  { key: 'pecota',  label: '11', name: 'Pecota',         x: 45, y: 58, color: 'var(--nu-midnight)' },
  { key: 'caf',     label: '3',  name: 'The Caf',        x: 23, y: 36, color: 'var(--nu-amber)' },
  { key: 'gym',     label: '13', name: 'Pavilion',       x: 33, y: 86, color: 'var(--nu-tour)' }
]

// === UPCOMING EVENTS ===
const now = new Date()
const upcomingEvents = computed(() => {
  type E = (typeof EVENTS)[number] & { start?: string }
  return [...(EVENTS as E[])]
    .filter(e => e.start && new Date(e.start).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime())
    .slice(0, 3)
})
function eventDay(e: any) {
  return e.start ? whenLabel(e.start, now) : e.date
}
function eventIn(e: any) {
  return e.start ? inLabel(e.start, now) : ''
}
function daysUntil(e: any) {
  if (!e.start) return ''
  const ms = new Date(e.start).getTime() - now.getTime()
  const d = Math.ceil(ms / 86_400_000)
  if (d <= 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  return `in ${d} days`
}

// === DIRECTIONS ===
const directionsOpen = ref(false)
onMounted(() => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (params.get('dirs') === '1') directionsOpen.value = true
  // Scroll to a specific section by index (?scroll=N, 0 = hero, 1 = map, etc.)
  const s = parseInt(params.get('scroll') || '', 10)
  if (!Number.isNaN(s) && s > 0) {
    requestAnimationFrame(() => {
      const root = document.querySelector('.home') as HTMLElement | null
      if (root) {
        const sections = root.querySelectorAll('section')
        if (sections[s]) {
          root.scrollTo({ top: (sections[s] as HTMLElement).offsetTop, behavior: 'smooth' })
        }
      }
    })
  }
})

// === COLLEGES (with icons + programs) ===
interface College {
  name: string
  tagline: string
  color: string
  icon: string
  programs: string[]
}
const colleges: College[] = [
  { name: 'College of Arts, Sciences, and Technology', tagline: 'Biology · English · Communication · Computer Science · Exercise Science', color: 'var(--nu-blue)',     icon: '⚛', programs: ['Biology','English','Communication','Exercise Science','Interdisciplinary','Psychology'] },
  { name: 'College of Ministry',                       tagline: 'Biblical Studies · Intercultural Studies · Pastoral Ministries · Worship',     color: 'var(--nu-navy)',     icon: '✦', programs: ['Biblical & Theological Studies','Intercultural Studies & Missions','Pastoral Ministries','Worship & Music Studies','Youth, Children & Family'] },
  { name: 'College of Health Sciences',                 tagline: 'Health sciences foundation for nursing and PA Medicine',                     color: 'var(--nu-leaf)',     icon: '♥', programs: ['Health Sciences','Pre-PA Track','Pre-Med Track','Kinesiology'] },
  { name: 'School of Nursing',                          tagline: 'Prelicensure BSN program for whole-person care',                            color: 'var(--nu-amber)',    icon: '✚', programs: ['BSN Prelicensure','RN-to-BSN','MSN'] },
  { name: 'School of PA Medicine',                      tagline: 'Master of Science in Physician Assistant Studies',                            color: 'var(--nu-tour)',     icon: '⚕', programs: ['MS PA Studies'] },
  { name: 'College of Social & Behavioral Sciences',    tagline: 'Psychology · Clinical Mental Health Counseling · Counseling Psychology',     color: 'var(--nu-alt)',      icon: '◐', programs: ['BA Psychology','MA Clinical Mental Health Counseling','PsyD Counseling Psychology'] },
  { name: 'College of Professional Studies',            tagline: 'School of Business · School of Education',                                   color: 'var(--nu-midnight)', icon: '◆', programs: ['BA Business Administration','BA Management','BA Marketing','BA Educational Studies'] },
  { name: 'Center for Leadership Studies',              tagline: 'BA, EdD, and PhD in Organizational Leadership',                                color: 'var(--nu-blue)',     icon: '✣', programs: ['BA Organizational Leadership','EdD Organizational Leadership','PhD Organizational Leadership'] },
  { name: 'Creatio Center for Technology, Media & Design', tagline: 'For designers, coders, and makers',                                        color: 'var(--nu-tour)',     icon: '✱', programs: ['Computer Science','Film Production','Human-Centered Design','Music Production','Visual Design'] }
]

// Marquee: duplicate colleges so we can loop seamlessly
const marqueeRow1 = colleges.slice(0, 5)
const marqueeRow2 = colleges.slice(4)

// === QUIZ ===
interface QuizQuestion {
  q: string
  options: string[]
  answer: number
  fact: string
}
const quiz: QuizQuestion[] = [
  { q: 'When was Northwest University founded?',     options: ['1898','1934','1962','1975'],         answer: 1, fact: 'Founded in 1934 in Seattle; the university later moved to its Kirkland campus.' },
  { q: 'Where is the main campus located?',           options: ['Seattle, WA','Kirkland, WA','Portland, OR','Spokane, WA'], answer: 1, fact: 'The main campus is at 5520 108th Ave NE, Kirkland, WA 98033.' },
  { q: 'How large is the Kirkland campus?',           options: ['12 acres','56 acres','120 acres','350 acres'], answer: 1, fact: 'The campus is a semi-wooded tract of 56 acres overlooking Lake Washington.' },
  { q: 'Which of these is a Northwest mascot?',       options: ['Lion','Bear','Eagle','Wolf'],         answer: 2, fact: 'NU is the Eagles — students and teams are known as the Eagles.' },
  { q: 'What is NU\u2019s affiliation?',                options: ['Baptist','Assemblies of God','Methodist','Non-denominational'], answer: 1, fact: 'Northwest University is a Christian university affiliated with the Assemblies of God.' },
  { q: 'Who is the current NU president?',            options: ['Dr. Jeremy Johnson','Dr. Mark Sargent','Dr. Joseph Castleberry','Dr. Dennis Davis'], answer: 0, fact: 'Dr. Jeremy Johnson serves as president; he is a 1998 graduate of Northwest University.' }
]
const quizIdx = ref(0)
const quizPicked = ref<number | null>(null)
const quizDone = ref(false)
const quizConfetti = ref(false)
const currentQ = computed(() => quiz[quizIdx.value])
const score = ref(0)
const isCorrect = computed(() => quizPicked.value === currentQ.value.answer)
const quizProgress = computed(() => (quizIdx.value + (quizPicked.value !== null ? 1 : 0)) / quiz.length)

function pickAnswer(i: number) {
  if (quizPicked.value !== null) return
  quizPicked.value = i
  if (i === currentQ.value.answer) {
    score.value++
    quizConfetti.value = true
    setTimeout(() => quizConfetti.value = false, 1100)
  }
  setTimeout(nextQuestion, 1800)
}
function nextQuestion() {
  if (quizIdx.value < quiz.length - 1) {
    quizIdx.value++
    quizPicked.value = null
  } else {
    quizDone.value = true
  }
}
function restartQuiz() {
  quizIdx.value = 0
  quizPicked.value = null
  quizDone.value = false
  score.value = 0
}

// === ABOUT (with visual icons) ===
const aboutFacts = [
  { value: '1934',       label: 'Year founded',          icon: '◐', color: 'var(--nu-blue)' },
  { value: '56',         label: 'Acres on Lake Washington', icon: '◉', color: 'var(--nu-navy)' },
  { value: '22',         label: 'Undergraduate majors',  icon: '✦', color: 'var(--nu-tour)' },
  { value: '9',          label: 'Eagles athletic teams', icon: '◆', color: 'var(--nu-leaf)' },
  { value: '20+',        label: 'Clubs and organizations', icon: '✺', color: 'var(--nu-amber)' },
  { value: 'Kirkland, WA', label: 'Main campus',         icon: '◈', color: 'var(--nu-midnight)' }
]
</script>

<template>
  <div class="home">
    <!-- ============ HERO ============ -->
    <section class="hero" :class="{ 'is-loaded': heroVisible }">
      <div class="hero-photo">
        <img :src="`/images/${heroPhoto}`" alt="Northwest University campus" />
      </div>
      <div class="hero-veil" />
      <div class="hero-content">
        <div class="hero-eyebrow">
          <span class="live-dot" />
          <span>{{ label }} · Welcome</span>
        </div>
        <h1 class="hero-title">Follow Your Faith.<br/>Find Your Future.</h1>
        <p class="hero-blurb">Kirkland, Washington &middot; Since 1934</p>
        <div class="hero-stickers">
          <span class="sticker">✦ Spirit</span>
          <span class="sticker">⚛ Mind</span>
          <span class="sticker">✣ Service</span>
        </div>
        <div class="hero-stats">
          <div v-for="(s, i) in stats" :key="s.label" class="stat" :style="{ animationDelay: `${i * 120}ms` }">
            <div class="stat-value">{{ displayed[i] }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ MAP & DIRECTIONS ============ -->
    <section class="map-section">
      <div class="section-head">
        <div class="eyebrow">Find Us</div>
        <h2 class="h2">Campus Map &amp; Directions</h2>
        <p class="body">5520 108th Ave N.E., Kirkland, WA 98033 · 425-822-8266</p>
      </div>
      <div class="map-card">
        <img src="/images/campus_map_2016.jpg" alt="Northwest University Kirkland campus map" />
        <!-- Visual interactive building pins overlaid on the map -->
        <button
          v-for="(p, i) in mapPins"
          :key="p.key"
          class="map-pin"
          :style="{
            left: p.x + '%',
            top:  p.y + '%',
            background: p.color,
            animationDelay: `${i * 80}ms`
          }"
          :aria-label="`Open directions to ${p.name}`"
          @click="directionsOpen = true"
        >
          <span class="pin-num">{{ p.label }}</span>
          <span class="pin-name">{{ p.name }}</span>
        </button>
      </div>
      <div class="map-actions">
        <button class="btn btn-primary" @click="directionsOpen = true">
          Get Directions
          <span class="btn-arrow">↗</span>
        </button>
        <div class="map-legend">
          <span>Tip:</span> Tap any building on the map for directions
        </div>
      </div>
    </section>

    <!-- ============ UPCOMING EVENTS ============ -->
    <section class="events-section">
      <div class="section-head">
        <div class="eyebrow">What's Next</div>
        <h2 class="h2">Upcoming Events</h2>
      </div>

      <div class="event-cards">
        <article
          v-for="(e, i) in upcomingEvents"
          :key="e.id"
          class="event-mini hover-lift"
          :class="{ 'is-featured': i === 0 }"
          :style="{ animationDelay: `${i * 80}ms` }"
        >
          <img v-if="e.image" class="event-photo" :src="`/images/${e.image}`" :alt="e.title" />
          <div class="event-overlay" />
          <!-- Pulsing "Up Next" badge for the first event -->
          <div v-if="i === 0" class="upnext-badge">
            <span class="pulse-dot" />
            Up Next
          </div>
          <div class="event-body">
            <div class="event-when">
              <div class="day-block">
                <div class="day-num">{{ new Date(e.start).getDate() }}</div>
                <div class="day-month">{{ new Date(e.start).toLocaleDateString('en-US', { month: 'short' }) }}</div>
              </div>
              <div class="when-text">
                <div class="when-time">{{ e.time }}</div>
                <div class="when-in">{{ eventIn(e) }}</div>
              </div>
            </div>
            <h3 class="event-title">{{ e.title }}</h3>
            <div class="event-loc">📍 {{ e.location }}</div>
          </div>
        </article>
      </div>
      <button class="btn btn-ghost all-events" @click="router.push('/events')">
        See all events
        <span class="btn-arrow">→</span>
      </button>
    </section>

    <!-- ============ COLLEGES — infinite marquee + grid ============ -->
    <section class="colleges-section">
      <div class="section-head">
        <div class="eyebrow">Academics</div>
        <h2 class="h2">Academic Programs</h2>
        <p class="body">22 majors &middot; 6 colleges &middot; 3 centers</p>
      </div>

      <!-- Marquee row 1: scrolling program names -->
      <div class="marquee">
        <div class="marquee-track" :style="{ animationDuration: `${marqueeRow1.length * 6}s` }">
          <span v-for="(c, i) in marqueeRow1" :key="`m1-${i}`" class="marquee-pill" :style="{ background: c.color }">
            <span class="marquee-icon">{{ c.icon }}</span>
            {{ c.name }}
          </span>
          <span v-for="(c, i) in marqueeRow1" :key="`m1b-${i}`" class="marquee-pill" :style="{ background: c.color }">
            <span class="marquee-icon">{{ c.icon }}</span>
            {{ c.name }}
          </span>
        </div>
      </div>
      <div class="marquee reverse">
        <div class="marquee-track reverse" :style="{ animationDuration: `${marqueeRow2.length * 6}s` }">
          <span v-for="(c, i) in marqueeRow2" :key="`m2-${i}`" class="marquee-pill" :style="{ background: c.color }">
            <span class="marquee-icon">{{ c.icon }}</span>
            {{ c.name }}
          </span>
          <span v-for="(c, i) in marqueeRow2" :key="`m2b-${i}`" class="marquee-pill" :style="{ background: c.color }">
            <span class="marquee-icon">{{ c.icon }}</span>
            {{ c.name }}
          </span>
        </div>
      </div>

      <!-- Grid with details -->
      <div class="colleges-grid stagger">
        <div
          v-for="(c, i) in colleges"
          :key="c.name"
          class="college-tile"
          :style="{ '--pillar-color': c.color, animationDelay: `${i * 60}ms` }"
          @click="router.push('/academics')"
        >
          <div class="ct-bar" />
          <div class="ct-icon">{{ c.icon }}</div>
          <h3 class="ct-name">{{ c.name }}</h3>
          <p class="ct-tag">{{ c.tagline }}</p>
          <div class="ct-arrow">→</div>
        </div>
      </div>
    </section>

    <!-- ============ NU QUIZ ============ -->
    <section class="quiz-section">
      <div class="section-head">
        <div class="eyebrow">Try It</div>
        <h2 class="h2">How Well Do You Know NU?</h2>
        <p class="body">6 questions. Pick an answer. Get a fun fact.</p>
      </div>

      <!-- Progress bar -->
      <div v-if="!quizDone" class="quiz-progressbar">
        <div class="quiz-progressbar-track">
          <div class="quiz-progressbar-fill" :style="{ width: `${quizProgress * 100}%` }" />
        </div>
        <div class="quiz-progressbar-label">
          Question {{ quizIdx + 1 }} / {{ quiz.length }} · Score {{ score }}
        </div>
      </div>

      <div class="quiz-card" :class="{ 'is-finished': quizDone, 'is-correct-flash': quizConfetti }">
        <!-- Confetti burst -->
        <div v-if="quizConfetti" class="confetti" aria-hidden="true">
          <span v-for="n in 18" :key="n" class="confetti-piece" :style="{
            '--n': n,
            '--x': (Math.random() * 100) + '%',
            '--rot': (Math.random() * 720) + 'deg',
            '--delay': (Math.random() * 0.2) + 's'
          }" />
        </div>

        <template v-if="!quizDone">
          <h3 class="quiz-q">{{ currentQ.q }}</h3>
          <div class="quiz-opts">
            <button
              v-for="(opt, i) in currentQ.options"
              :key="i"
              class="quiz-opt"
              :class="{
                'is-picked':  quizPicked === i,
                'is-correct': quizPicked !== null && i === currentQ.answer,
                'is-wrong':   quizPicked === i && i !== currentQ.answer
              }"
              :disabled="quizPicked !== null"
              @click="pickAnswer(i)"
            >
              <span class="qo-letter">{{ ['A','B','C','D'][i] }}</span>
              <span class="qo-text">{{ opt }}</span>
              <span v-if="quizPicked !== null && i === currentQ.answer" class="qo-icon">✓</span>
              <span v-else-if="quizPicked === i && i !== currentQ.answer" class="qo-icon">✗</span>
            </button>
          </div>
          <transition name="fact">
            <div v-if="quizPicked !== null" class="quiz-fact" :class="{ 'is-correct': isCorrect, 'is-wrong': !isCorrect }">
              <strong>{{ isCorrect ? '✓ Correct!' : '✗ Not quite.' }}</strong>
              {{ currentQ.fact }}
            </div>
          </transition>
        </template>

        <template v-else>
          <div class="quiz-result">
            <div class="quiz-score">
              <div class="qs-num">{{ score }}<span class="qs-of">/{{ quiz.length }}</span></div>
              <div class="qs-ring" :style="{ '--pct': (score / quiz.length) * 100 + '%' }">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" class="ring-bg" />
                  <circle cx="50" cy="50" r="44" class="ring-fg" />
                </svg>
              </div>
            </div>
            <div class="qs-label">
              <template v-if="score === quiz.length">Perfect. You bleed blue.</template>
              <template v-else-if="score >= 4">Great. You know your school.</template>
              <template v-else-if="score >= 2">Solid start. Keep exploring.</template>
              <template v-else>Welcome to the Hill — there's a lot to discover.</template>
            </div>
            <button class="btn btn-primary" @click="restartQuiz">Play Again</button>
          </div>
        </template>
      </div>
    </section>

    <!-- ============ ABOUT NU ============ -->
    <section class="about-section">
      <div class="section-head">
        <div class="eyebrow">About</div>
        <h2 class="h2">Northwest at a Glance</h2>
      </div>
      <div class="about-facts stagger">
        <div
          v-for="(f, i) in aboutFacts"
          :key="f.label"
          class="af-tile"
          :style="{ '--accent': f.color, animationDelay: `${i * 60}ms` }"
        >
          <div class="af-icon">{{ f.icon }}</div>
          <div class="af-value">{{ f.value }}</div>
          <div class="af-label">{{ f.label }}</div>
        </div>
      </div>
    </section>

    <p class="hint">Tap <strong>☰</strong> to explore worlds · Swipe <kbd>←</kbd> <kbd>→</kbd> to change</p>

    <DirectionsPanel :open="directionsOpen" @close="directionsOpen = false" />
  </div>
</template>

<style scoped>
.home {
  position: absolute; inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  background: var(--nu-wisp);
}
.home::-webkit-scrollbar { display: none; }

/* === Common section padding === */
section { padding: 80px 56px; }
.section-head { margin-bottom: 40px; max-width: 90%; }
.section-head .eyebrow { color: var(--nu-blue); font-size: 18px; margin-bottom: 14px; }
.section-head h2 { letter-spacing: -0.01em; margin-bottom: 14px; }
.section-head p  { color: var(--nu-navy); max-width: 56ch; }
.section-head a { color: var(--nu-blue); text-decoration: underline; }

/* === HERO === */
.hero {
  position: relative;
  height: 760px;
  padding: 0;
  overflow: hidden;
  background: var(--nu-midnight);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s var(--ease-out-soft), transform 0.6s var(--ease-out-soft);
}
.hero.is-loaded { opacity: 1; transform: none; }
.hero-photo { position: absolute; inset: 0; }
.hero-photo img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
  animation: kenburns 22s ease-in-out infinite alternate;
}
.hero-veil {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,38,61,0.55) 0%, rgba(0,38,61,0.2) 30%, rgba(0,38,61,0.85) 100%);
}
.hero-content {
  position: absolute; inset: 0;
  padding: 80px 80px 100px;
  display: flex; flex-direction: column;
  justify-content: flex-end;
  color: var(--nu-wisp);
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 12px;
  color: var(--nu-tour);
  font-size: 16px; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase;
  margin-bottom: 18px;
  animation: fadeUp 0.7s var(--ease-out-soft) 0.1s both;
}
.live-dot {
  display: inline-block;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--nu-leaf);
  box-shadow: 0 0 0 0 rgba(68, 186, 130, 0.7);
  animation: pulse-live 1.6s ease-in-out infinite;
}
@keyframes pulse-live {
  0%, 100% { box-shadow: 0 0 0 0 rgba(68, 186, 130, 0.7); }
  50% { box-shadow: 0 0 0 12px rgba(68, 186, 130, 0); }
}
.hero-title {
  font-family: var(--font-serif);
  font-size: 88px;
  line-height: 0.98;
  color: var(--nu-wisp);
  margin: 0 0 20px;
  letter-spacing: -0.01em;
  animation: fadeUp 0.8s var(--ease-out-soft) 0.2s both;
}
.hero-blurb {
  font-size: 24px;
  line-height: 1.4;
  color: var(--nu-skylight);
  max-width: 60ch;
}
.hero-stickers {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.sticker {
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 199, 44, 0.5);
  color: var(--nu-wisp);
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.08em;
  backdrop-filter: blur(6px);
  animation: floatY 3.5s ease-in-out infinite;
}
.sticker:nth-child(2) { animation-delay: 0.6s; }
.sticker:nth-child(3) { animation-delay: 1.2s; }
.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 28px 0;
  border-top: 1px solid rgba(255,255,255,0.18);
  animation: fadeUp 0.8s var(--ease-out-soft) 0.4s both;
}
.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 28px 0;
  border-top: 1px solid rgba(255,255,255,0.18);
  animation: fadeUp 0.8s var(--ease-out-soft) 0.4s both;
}
.stat {
  position: relative;
  animation: popIn 0.4s var(--ease-out-soft) both;
}
@keyframes popIn {
  0%   { opacity: 0; transform: scale(0.6); }
  60%  { opacity: 1; transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
}
.stat-value {
  font-family: var(--font-serif);
  font-size: 64px; line-height: 1;
  color: var(--nu-wisp);
  margin-bottom: 6px;
  font-variant-numeric: tabular-nums;
}
.stat-label {
  font-size: 13px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--nu-sky);
}

/* === MAP === */
.map-section { background: var(--nu-powder); }
.map-card {
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  background: var(--nu-wisp);
  box-shadow: 0 8px 24px rgba(0, 38, 61, 0.1);
  border: 1px solid var(--nu-sky);
  margin-bottom: 32px;
}
.map-card img {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  pointer-events: none;
}

.map-pin {
  position: absolute;
  display: flex; flex-direction: column; align-items: center;
  gap: 4px;
  background: var(--nu-blue);
  border: 4px solid var(--nu-wisp);
  border-radius: 999px;
  padding: 8px 14px;
  color: var(--nu-wisp);
  font-family: var(--font-sans);
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s var(--ease-out-soft), box-shadow 0.25s;
  animation: popIn 0.5s var(--ease-out-soft) both;
  transform: translate(-50%, -50%);
  z-index: 2;
}
.map-pin:hover {
  transform: translate(-50%, -50%) scale(1.18);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35), 0 0 0 6px rgba(255, 199, 44, 0.4);
  z-index: 3;
}
.map-pin::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 999px;
  border: 2px solid currentColor;
  opacity: 0;
  pointer-events: none;
  animation: ping 2s ease-out infinite;
}
@keyframes ping {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
}
.map-pin:active { transform: translate(-50%, -50%) scale(1.05); }
.pin-num {
  font-family: var(--font-serif);
  font-size: 22px; font-weight: 700;
  line-height: 1;
}
.pin-name {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
  display: none;
}
.map-pin:hover .pin-name { display: inline; }

.map-actions {
  display: flex; align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.map-legend {
  font-size: 15px; color: var(--nu-navy); opacity: 0.75;
  display: inline-flex; align-items: center; gap: 6px;
}
.map-legend span { font-weight: 700; color: var(--nu-blue); opacity: 1; }

/* === EVENTS === */
.events-section { background: var(--nu-wisp); }
.event-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}
.event-mini {
  position: relative;
  height: 460px;
  border-radius: 24px;
  overflow: hidden;
  background: var(--nu-cloud);
  box-shadow: 0 6px 18px rgba(0, 38, 61, 0.08);
  animation: fadeUp 0.7s var(--ease-out-soft) both;
  transition: transform 0.3s var(--ease-out-soft), box-shadow 0.3s;
}
.event-mini:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(0, 38, 61, 0.14); }
.event-mini.is-featured {
  outline: 3px solid var(--nu-tour);
  outline-offset: -3px;
}
.event-photo {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  display: block;
  transition: transform 1s var(--ease-out-soft);
}
.event-mini:hover .event-photo { transform: scale(1.05); }
.event-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,38,61,0.1) 30%, rgba(0,38,61,0.95) 100%);
}

.upnext-badge {
  position: absolute;
  top: 16px; right: 16px;
  z-index: 2;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px;
  background: var(--nu-tour);
  color: var(--nu-midnight);
  border-radius: 999px;
  font-size: 14px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}
.pulse-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--nu-midnight);
  animation: pulse-live 1.4s ease-in-out infinite;
}

.event-body {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 24px;
  color: var(--nu-wisp);
  z-index: 1;
}
.event-when {
  display: flex; gap: 18px;
  margin-bottom: 12px;
  align-items: center;
}
.day-block {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 14px;
  padding: 10px 12px;
  min-width: 76px;
  flex-shrink: 0;
}
.day-name {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--nu-skylight);
  margin-bottom: 2px;
}
.day-num {
  font-family: var(--font-serif);
  font-size: 38px; line-height: 1;
  color: var(--nu-tour);
  font-weight: 700;
  line-height: 1;
}
.day-month {
  font-size: 12px; font-weight: 700;
  color: var(--nu-skylight);
  letter-spacing: 0.1em; text-transform: uppercase;
  margin-top: 2px;
}
.when-text {
  flex: 1;
  display: flex; flex-direction: column; gap: 2px;
}
.when-day {
  font-family: var(--font-serif);
  font-size: 20px; line-height: 1.1;
  color: var(--nu-wisp);
  font-weight: 700;
}
.when-time { font-size: 15px; color: var(--nu-tour); font-weight: 600; }
.when-in   { font-size: 13px; color: var(--nu-skylight); }

.event-body .card-eyebrow { margin-bottom: 6px; }
.event-title {
  font-family: var(--font-serif);
  font-size: 26px; line-height: 1.1;
  color: var(--nu-wisp);
  margin: 0 0 4px;
}
.event-loc { font-size: 14px; color: var(--nu-skylight); }

.all-events {
  font-size: 17px; font-weight: 700;
  padding: 0 32px;
  min-height: 64px;
}

/* === COLLEGES === */
.colleges-section {
  background: linear-gradient(180deg, var(--nu-cloud) 0%, var(--nu-powder) 100%);
  padding-bottom: 96px;
}

/* Marquee: infinite scroll of college names */
.marquee {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  margin: 8px 0 16px;
}
.marquee-track {
  display: inline-flex;
  gap: 12px;
  padding-left: 12px;
  animation: marquee linear infinite;
}
.marquee-track.reverse { animation-direction: reverse; }
.marquee-pill {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 22px;
  border-radius: 999px;
  color: var(--nu-wisp);
  font-family: var(--font-serif);
  font-size: 22px;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 38, 61, 0.12);
  transition: transform 0.25s;
}
.marquee-pill:hover { transform: scale(1.05); }
.marquee-icon {
  font-size: 24px;
  color: var(--nu-tour);
}
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.colleges-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 32px;
}
.college-tile {
  position: relative;
  background: var(--nu-wisp);
  border-radius: 22px;
  padding: 32px;
  animation: fadeUp 0.6s var(--ease-out-soft) both;
  transition: transform 0.3s var(--ease-out-soft), box-shadow 0.3s;
  border: 1px solid var(--nu-cloud);
  cursor: pointer;
  overflow: hidden;
}
.college-tile:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 28px rgba(0, 38, 61, 0.12);
}
.college-tile::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--pillar-color);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 0;
}
.college-tile:hover::before { opacity: 0.05; }
.ct-bar {
  width: 64px; height: 6px;
  background: var(--pillar-color, var(--nu-blue));
  border-radius: 3px;
  margin-bottom: 16px;
  position: relative; z-index: 1;
}
.ct-icon {
  position: absolute;
  top: 24px; right: 28px;
  font-size: 56px;
  font-family: var(--font-serif);
  color: var(--pillar-color);
  opacity: 0.18;
  transition: opacity 0.3s, transform 0.3s;
  z-index: 0;
}
.college-tile:hover .ct-icon { opacity: 0.35; transform: scale(1.1) rotate(-5deg); }
.ct-name {
  font-family: var(--font-serif);
  font-size: 26px; line-height: 1.15;
  color: var(--nu-midnight);
  margin: 0 0 10px;
  position: relative; z-index: 1;
}
.ct-tag {
  font-size: 16px; line-height: 1.4;
  color: var(--nu-navy);
  margin: 0;
  position: relative; z-index: 1;
}
.ct-arrow {
  position: absolute;
  bottom: 28px; right: 32px;
  font-family: var(--font-serif);
  font-size: 28px;
  color: var(--pillar-color);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.3s, transform 0.3s;
  z-index: 1;
}
.college-tile:hover .ct-arrow { opacity: 1; transform: translateX(0); }

/* === QUIZ === */
.quiz-section { background: var(--nu-powder); }

.quiz-progressbar {
  display: flex; align-items: center; gap: 18px;
  margin-bottom: 18px;
  animation: fadeUp 0.5s var(--ease-out-soft) both;
}
.quiz-progressbar-track {
  flex: 1;
  height: 8px;
  background: var(--nu-cloud);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}
.quiz-progressbar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--nu-blue) 0%, var(--nu-tour) 100%);
  border-radius: 4px;
  transition: width 0.4s var(--ease-out-soft);
  position: relative;
}
.quiz-progressbar-fill::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer-bar 1.8s linear infinite;
}
@keyframes shimmer-bar {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.quiz-progressbar-label {
  font-size: 14px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--nu-navy);
  white-space: nowrap;
}

.quiz-card {
  position: relative;
  background: var(--nu-wisp);
  border-radius: 28px;
  padding: 56px;
  box-shadow: 0 8px 24px rgba(0, 38, 61, 0.1);
  border: 1px solid var(--nu-sky);
  min-height: 460px;
  display: flex; flex-direction: column;
  transition: box-shadow 0.4s;
}
.quiz-card.is-correct-flash {
  box-shadow: 0 0 0 4px var(--nu-leaf), 0 12px 32px rgba(68, 186, 130, 0.3);
  animation: shake 0.4s var(--ease-out-soft);
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.quiz-q {
  font-family: var(--font-serif);
  font-size: 44px; line-height: 1.15;
  color: var(--nu-midnight);
  margin: 0 0 32px;
  max-width: 28ch;
}
.quiz-opts {
  display: flex; flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
}
.quiz-opt {
  display: flex; align-items: center; gap: 20px;
  padding: 22px 28px;
  background: var(--nu-cloud);
  border: 2px solid var(--nu-cloud);
  border-radius: 18px;
  text-align: left;
  cursor: pointer;
  min-height: 72px;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
  font-size: 20px; font-weight: 600;
  color: var(--nu-midnight);
  position: relative;
  overflow: hidden;
}
.quiz-opt::after {
  content: '';
  position: absolute;
  left: -100%;
  top: 0; bottom: 0;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s var(--ease-out-soft);
}
.quiz-opt:hover:not(:disabled) {
  background: var(--nu-powder);
  border-color: var(--nu-sky);
}
.quiz-opt:hover:not(:disabled)::after { left: 100%; }
.quiz-opt:active:not(:disabled) { transform: scale(0.99); }
.quiz-opt:disabled { cursor: default; }
.quiz-opt.is-correct {
  background: var(--nu-leaf);
  border-color: var(--nu-leaf);
  color: var(--nu-wisp);
  animation: pop 0.4s var(--ease-out-soft);
}
.quiz-opt.is-wrong {
  background: var(--nu-amber);
  border-color: var(--nu-amber);
  animation: headShake 0.5s var(--ease-out-soft);
}
@keyframes pop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.04); }
  100% { transform: scale(1); }
}
@keyframes headShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
.qo-letter {
  width: 44px; height: 44px;
  background: var(--nu-navy);
  color: var(--nu-wisp);
  border-radius: 999px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-serif);
  font-size: 20px; font-weight: 700;
  flex-shrink: 0;
}
.quiz-opt.is-correct .qo-letter,
.quiz-opt.is-wrong   .qo-letter { background: var(--nu-midnight); }
.qo-text { flex: 1; }
.qo-icon {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--nu-wisp);
  color: var(--nu-midnight);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 700;
  animation: pop 0.4s var(--ease-out-soft);
}
.quiz-fact {
  padding: 20px 24px;
  background: var(--nu-powder);
  border-radius: 16px;
  font-size: 18px; line-height: 1.45;
  color: var(--nu-navy);
  border-left: 4px solid var(--nu-leaf);
}
.quiz-fact.is-wrong { border-left-color: var(--nu-amber); }
.fact-enter-active, .fact-leave-active { transition: opacity 0.4s, transform 0.4s; }
.fact-enter-from, .fact-leave-to { opacity: 0; transform: translateY(8px); }

/* Quiz result (final) */
.quiz-card.is-finished { align-items: center; text-align: center; }
.quiz-result { display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; }
.quiz-score {
  position: relative;
  display: inline-flex; align-items: center; justify-content: center;
  width: 200px; height: 200px;
}
.qs-num {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-serif);
  font-size: 80px; line-height: 1;
  color: var(--nu-blue);
  z-index: 1;
}
.qs-of { font-size: 36px; color: var(--nu-navy); opacity: 0.6; }
.qs-ring { position: absolute; inset: 0; }
.qs-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: var(--nu-cloud); stroke-width: 8; }
.ring-fg {
  fill: none;
  stroke: var(--nu-tour);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 276.46; /* 2π·44 */
  stroke-dashoffset: 276.46;
  animation: ring-fill 1.4s var(--ease-out-soft) 0.2s forwards;
}
@keyframes ring-fill {
  to { stroke-dashoffset: calc(276.46 - 276.46 * var(--pct, 0)); }
}
.qs-label {
  font-family: var(--font-serif);
  font-size: 28px;
  color: var(--nu-navy);
  max-width: 28ch;
}

/* Confetti */
.confetti {
  position: absolute; inset: 0;
  pointer-events: none;
  overflow: visible;
  z-index: 5;
}
.confetti-piece {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px; height: 12px;
  background: var(--nu-tour);
  border-radius: 2px;
  --x: 0;
  --rot: 0deg;
  --delay: 0s;
  transform-origin: center;
  animation: confetti-fly 0.9s var(--ease-out-soft) var(--delay) forwards;
}
.confetti-piece:nth-child(3n)   { background: var(--nu-blue); }
.confetti-piece:nth-child(3n+1) { background: var(--nu-leaf); border-radius: 50%; }
.confetti-piece:nth-child(3n+2) { background: var(--nu-amber); }
@keyframes confetti-fly {
  0%   { transform: translate(-50%, -50%) translate(0, 0) rotate(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) translate(calc(var(--x) - 50%), -260px) rotate(var(--rot)); opacity: 0; }
}

/* === ABOUT === */
.about-section { background: var(--nu-wisp); }
.about-facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.af-tile {
  background: var(--nu-powder);
  border-radius: 24px;
  padding: 32px;
  animation: fadeUp 0.6s var(--ease-out-soft) both;
  border: 1px solid var(--nu-sky);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s var(--ease-out-soft), box-shadow 0.3s;
}
.af-tile::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 0;
}
.af-tile:hover {
  transform: translateY(-4px) rotate(-0.5deg);
  box-shadow: 0 12px 28px rgba(0, 38, 61, 0.12);
}
.af-tile:hover::before { opacity: 0.06; }
.af-icon {
  position: relative; z-index: 1;
  font-family: var(--font-serif);
  font-size: 48px;
  color: var(--accent);
  margin-bottom: 10px;
  line-height: 1;
}
.af-value {
  position: relative; z-index: 1;
  font-family: var(--font-serif);
  font-size: 56px; line-height: 1;
  color: var(--nu-midnight);
  margin-bottom: 6px;
}
.af-label {
  position: relative; z-index: 1;
  font-size: 15px; font-weight: 600;
  color: var(--nu-navy);
  letter-spacing: 0.04em;
}

.hint {
  text-align: center;
  font-size: 16px;
  color: var(--nu-navy);
  opacity: 0.55;
  padding: 40px 80px 80px;
  letter-spacing: 0.04em;
}
.hint kbd {
  display: inline-block;
  padding: 3px 10px;
  border: 1px solid var(--nu-sky);
  border-radius: 6px;
  background: var(--nu-wisp);
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--nu-navy);
  margin: 0 3px;
}
</style>
