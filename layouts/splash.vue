<script setup lang="ts"></script>

<template>
  <div class="splash-shell">
    <slot />
  </div>
</template>

<style scoped>
.splash-shell {
  position: absolute; inset: 0;
  width: 1080px;
  height: 1920px;
  overflow: hidden;
  background: var(--nu-midnight);
}
</style>
