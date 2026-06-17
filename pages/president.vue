<script setup lang="ts">
const solo    = '250722DrJeremyJohnson-.jpg'
const podium  = 'JeremyJohnsonConvocation-1688.jpg'

const milestones = [
  { year: '1997',  title: 'Married Leanne',     detail: 'Met and married while students at Northwest.' },
  { year: '1998',  title: 'B.A., Northwest',    detail: 'Graduates from the university he would one day lead.' },
  { year: '8 yrs', title: 'Youth Pastor',      detail: 'Investing in students and their faith.' },
  { year: '5 yrs', title: 'On the Road',       detail: 'Public-school assembly speaker across the country.' },
  { year: '3 yrs', title: 'Seattle Pastor',    detail: 'Pastored a church in the Seattle area before heading to North Point.' },
  { year: '13 yrs',title: 'North Point Church',detail: 'Lead pastor. Nearly 4,000 public water baptisms.' },
  { year: '2019',  title: 'Ed.D.',             detail: 'Southeastern University.' },
  { year: '2025',  title: '7th President',     detail: 'Returns to Kirkland as the seventh president.' }
]
</script>

<template>
  <div class="world-body-inner president-page">
    <WorldHeader
      eyebrow="Office of the President"
      title="Dr. Jeremy Johnson."
      subtitle="7th President &middot; Class of 1998"
    />

    <!-- HERO: solo portrait HUGE + identity card -->
    <section class="hero">
      <div class="portrait-card">
        <img :src="`/images/${solo}`" alt="Dr. Jeremy Johnson" />
        <div class="portrait-veil" />
        <div class="portrait-content">
          <div class="role">President</div>
          <h2 class="portrait-name">Dr. Jeremy Johnson</h2>
          <div class="portrait-meta">Seventh President &middot; since Fall 2025</div>
        </div>
      </div>

      <div class="identity-card">
        <div class="ic-eyebrow">The Calling</div>
        <blockquote class="ic-quote">
          &ldquo;Be a voice of encouragement to a generation of people toward Jesus.&rdquo;
        </blockquote>
        <div class="ic-where">Heard one night in a small prayer room on the NU campus.</div>

        <div class="ic-divider" />

        <div class="ic-eyebrow">Credentials</div>
        <ul class="ic-creds">
          <li><span class="ic-degree">Ed.D.</span><span class="ic-school">Southeastern University &middot; 2019</span></li>
          <li><span class="ic-degree">M.A.</span><span class="ic-school">Global University &middot; 2006</span></li>
          <li><span class="ic-degree">B.A.</span><span class="ic-school">Northwest University &middot; 1998</span></li>
        </ul>
      </div>
    </section>

    <!-- PULL QUOTE: full-width bold statement -->
    <div class="pull-quote">
      <div class="pq-mark">&ldquo;</div>
      <p class="pq-text">
        I believe in this generation. I believe in the power of God's call. And I believe that
        world-changing, eternal impact can rise right here from the Pacific Northwest.
      </p>
      <div class="pq-attr">&mdash; Dr. Jeremy Johnson</div>
    </div>

    <!-- THE JOURNEY: 8-item row -->
    <section class="journey">
      <h2 class="h2 sect">The Journey Home.</h2>
      <div class="timeline stagger">
        <div v-for="(m, i) in milestones" :key="m.year + i" class="tm-item" :style="{ animationDelay: `${i * 50}ms` }">
          <div class="tm-year">{{ m.year }}</div>
          <div class="tm-title">{{ m.title }}</div>
          <div class="tm-detail">{{ m.detail }}</div>
        </div>
      </div>
    </section>

    <!-- AT THE PODIUM: full-width convocation photo with quote -->
    <section class="convocation">
      <img :src="`/images/${podium}`" alt="Dr. Johnson addressing convocation" />
      <div class="conv-veil" />
      <div class="conv-overlay">
        <div class="conv-eyebrow">7th Inaugural Address</div>
        <blockquote class="conv-quote">
          &ldquo;World-changing, eternal impact can rise right here from the Pacific Northwest.&rdquo;
        </blockquote>
        <div class="conv-attr">&mdash; Dr. Jeremy Johnson, 7th President of Northwest University</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.world-body-inner {
  position: absolute; inset: 0;
  padding: 28px 56px 36px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  min-height: 0;
  background: var(--nu-wisp);
}
.world-body-inner::-webkit-scrollbar { display: none; }
.president-page { background: var(--nu-wisp); }

/* === HERO: BIG === */
.hero {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 20px;
  margin: 16px 0 24px;
  height: 480px;
}
.portrait-card {
  position: relative;
  border-radius: 26px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 14px 32px rgba(0, 38, 61, 0.18);
  animation: scaleIn 0.6s var(--ease-out-soft) both;
}
.portrait-card img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center 22%;
  display: block;
}
.portrait-veil {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0, 38, 61, 0) 35%, rgba(0, 38, 61, 0.9) 100%);
}
.portrait-content {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 32px 34px;
  color: var(--nu-wisp);
}
.role {
  font-size: 14px; font-weight: 700;
  letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--nu-tour);
  margin-bottom: 8px;
}
.portrait-name {
  font-family: var(--font-serif);
  font-size: 48px; line-height: 1.02;
  margin: 0 0 6px;
  letter-spacing: -0.01em;
}
.portrait-meta {
  font-size: 16px;
  color: var(--nu-skylight);
}

.identity-card {
  background: linear-gradient(135deg, var(--nu-navy), var(--nu-midnight));
  border-radius: 26px;
  padding: 34px 36px;
  color: var(--nu-wisp);
  box-shadow: 0 14px 32px rgba(0, 38, 61, 0.22);
  position: relative; overflow: hidden;
  animation: fadeUp 0.6s var(--ease-out-soft) 0.08s both;
  display: flex; flex-direction: column;
  justify-content: center;
}
.identity-card::before {
  content: ''; position: absolute;
  top: -60px; right: -60px;
  width: 220px; height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 199, 44, 0.2) 0%, transparent 70%);
  pointer-events: none;
}
.ic-eyebrow {
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--nu-tour);
  margin-bottom: 12px;
  position: relative; z-index: 1;
}
.ic-quote {
  font-family: var(--font-serif);
  font-size: 28px; line-height: 1.22;
  font-style: italic;
  margin: 0 0 10px;
  color: var(--nu-wisp);
  position: relative; z-index: 1;
}
.ic-where {
  font-size: 14px;
  color: var(--nu-skylight);
  position: relative; z-index: 1;
}
.ic-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.18);
  margin: 22px 0 18px;
  position: relative; z-index: 1;
}
.ic-creds {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 10px;
  position: relative; z-index: 1;
}
.ic-creds li { display: flex; align-items: baseline; gap: 14px; }
.ic-degree {
  font-family: var(--font-serif);
  font-size: 20px; font-weight: 700;
  color: var(--nu-tour);
  min-width: 64px;
}
.ic-school {
  font-size: 15px;
  color: var(--nu-wisp);
  opacity: 0.92;
}

/* === PULL QUOTE === */
.pull-quote {
  position: relative;
  border-radius: 28px;
  margin: 0 0 24px;
  padding: 36px 48px;
  background: linear-gradient(135deg, var(--nu-midnight) 0%, var(--nu-navy) 60%, var(--nu-blue) 100%);
  color: var(--nu-wisp);
  text-align: center;
  overflow: hidden;
  animation: scaleIn 0.7s var(--ease-out-soft) 0.1s both;
  box-shadow: 0 14px 32px rgba(0, 38, 61, 0.18);
}
.pull-quote::after {
  content: ''; position: absolute;
  top: -100px; left: -100px;
  width: 320px; height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 199, 44, 0.18) 0%, transparent 70%);
  pointer-events: none;
}
.pq-mark {
  font-family: var(--font-serif);
  font-size: 110px; line-height: 0.5;
  color: var(--nu-tour);
  opacity: 0.55;
  margin-bottom: 8px;
  position: relative; z-index: 1;
}
.pq-text {
  font-family: var(--font-serif);
  font-size: 32px; line-height: 1.2;
  font-style: italic;
  margin: 0 0 14px;
  position: relative; z-index: 1;
}
.pq-attr {
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--nu-skylight);
  position: relative; z-index: 1;
}

/* === TIMELINE === */
.journey { margin: 0 0 32px; }
.journey .sect { margin: 0 0 18px; }
.timeline {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}
.tm-item {
  background: var(--nu-wisp);
  border-radius: 16px;
  padding: 14px 14px 12px;
  box-shadow: 0 4px 14px rgba(0, 38, 61, 0.06);
  border-top: 4px solid var(--nu-blue);
  animation: fadeUp 0.5s var(--ease-out-soft) both;
  display: flex; flex-direction: column; gap: 5px;
}
.tm-item:nth-child(4n+2) { border-top-color: var(--nu-tour); }
.tm-item:nth-child(4n+3) { border-top-color: var(--nu-navy); }
.tm-item:nth-child(4n)   { border-top-color: var(--nu-leaf); }
.tm-year {
  font-family: var(--font-serif);
  font-size: 20px; font-weight: 700;
  color: var(--nu-blue);
}
.tm-title {
  font-size: 14px; font-weight: 700;
  color: var(--nu-midnight);
  line-height: 1.15;
}
.tm-detail {
  font-size: 12px; line-height: 1.4;
  color: var(--nu-navy);
  opacity: 0.85;
}

/* === CONVOCATION: full-width === */
.convocation {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  height: 380px;
  margin-top: 8px;
  box-shadow: 0 16px 36px rgba(0, 38, 61, 0.18);
  animation: scaleIn 0.7s var(--ease-out-soft) 0.1s both;
}
.convocation img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center 28%;
  display: block;
}
.conv-veil {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(0,38,61,0.92) 0%, rgba(0,38,61,0.65) 45%, rgba(0,38,61,0.25) 100%);
}
.conv-overlay {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 55%;
  padding: 32px 40px;
  color: var(--nu-wisp);
  display: flex; flex-direction: column; justify-content: center;
}
.conv-eyebrow {
  font-size: 13px; font-weight: 700;
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--nu-tour);
  margin-bottom: 14px;
}
.conv-quote {
  font-family: var(--font-serif);
  font-size: 28px; line-height: 1.2;
  font-style: italic;
  margin: 0 0 14px;
}
.conv-attr {
  font-size: 12px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--nu-skylight);
  max-width: 50ch;
}
</style>
