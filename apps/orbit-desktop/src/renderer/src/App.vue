<script setup lang="ts">
import logo from './assets/logo.png'
</script>

<template>
  <main class="splash">
    <img :src="logo" alt="Orbit AI" class="splash__logo" draggable="false" />
  </main>
</template>

<style scoped>
.splash {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100dvh;
}

.splash__logo {
  width: 96px;
  height: 96px;
  object-fit: contain;
  user-select: none;
}
</style>
