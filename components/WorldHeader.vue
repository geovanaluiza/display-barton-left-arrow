<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
  kicker?: string
}>()
</script>

<template>
  <div class="world-header">
    <div>
      <div class="eyebrow">{{ eyebrow }}</div>
      <h1 class="display-2">{{ title }}</h1>
      <p v-if="subtitle" class="lede" style="margin-top: 16px">{{ subtitle }}</p>
    </div>
    <div v-if="kicker" class="kicker">
      <slot name="kicker">{{ kicker }}</slot>
    </div>
  </div>
</template>

<style scoped>
.kicker { display: flex; align-items: center; gap: 12px; }
</style>
