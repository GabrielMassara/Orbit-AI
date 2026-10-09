<script setup lang="ts">
import { onMounted } from 'vue'
import { init } from './state/init'
import ChatInput from './components/chat/ChatInput.vue'
import ChatMessages from './components/chat/ChatMessages.vue'
import AppSidebar from './components/sidebar/AppSidebar.vue'
import AppTopbar from './components/topbar/AppTopbar.vue'

onMounted(() => void init())
</script>

<template>
  <div class="app-shell">
    <AppSidebar />

    <div class="main">
      <AppTopbar />
      <ChatMessages />
      <ChatInput />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

.main {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
