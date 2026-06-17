<script setup lang="ts">
withDefaults(defineProps<{
  src: string
  title: string
  eyebrow?: string
  meta?: string
  height?: string
  interactive?: boolean
}>(), {
  interactive: true
})
</script>

<template>
  <div
    class="photo-card card"
    :class="{ 'is-static': !interactive }"
    :style="{ height: height || '320px' }"
  >
    <div
      class="card-photo"
      :style="{ backgroundImage: `url(/images/${src})` }"
    />
    <div class="card-overlay" />
    <div v-if="$slots.top" class="slot-top">
      <slot name="top" />
    </div>
    <div class="card-body">
      <div v-if="eyebrow" class="card-eyebrow">{{ eyebrow }}</div>
      <div class="card-title">{{ title }}</div>
      <div v-if="meta" class="card-meta">{{ meta }}</div>
      <slot name="body" />
    </div>
  </div>
</template>

<style scoped>
.photo-card {
  position: relative;
  width: 100%;
}
.photo-card.is-static { pointer-events: none; }
.slot-top {
  position: absolute; top: 24px; left: 24px;
  z-index: 2;
}
</style>
