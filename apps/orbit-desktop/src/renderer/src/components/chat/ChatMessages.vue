<script setup lang="ts">
import logo from '../../assets/logo.png'
</script>

<template>
  <main class="messages">
    <slot>
      <div class="empty-state">
        <img :src="logo" alt="" class="empty-state__logo" />
        <p>Envie uma mensagem para começar a conversar com o agente.</p>
      </div>
    </slot>
  </main>
</template>

<style scoped>
.messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 24px var(--content-gutter);
  overflow-y: auto;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 40px 20px;
  text-align: center;
}

.empty-state__logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 10px;
  opacity: 0.85;
}

.empty-state p {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-faint);
}
</style>
