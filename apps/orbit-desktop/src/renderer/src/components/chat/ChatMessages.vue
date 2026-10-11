<script setup lang="ts">
import { ref, watch } from 'vue'
import logo from '../../assets/logo.png'
import { messages } from '../../state/chat'
import AssistantMessage from './AssistantMessage.vue'
import SystemMessage from './SystemMessage.vue'
import ThinkingIndicator from './ThinkingIndicator.vue'
import UserMessage from './UserMessage.vue'

const container = ref<HTMLElement | null>(null)

function scrollToBottom(): void {
  const el = container.value
  if (el) el.scrollTop = el.scrollHeight
}

watch(messages, scrollToBottom, { deep: true, flush: 'post' })
</script>

<template>
  <main ref="container" class="messages">
    <div v-if="messages.length === 0" class="empty-state">
      <img :src="logo" alt="" class="empty-state__logo" />
      <p>Envie uma mensagem para começar a conversar com o agente.</p>
    </div>

    <template v-for="message in messages" :key="message.id">
      <UserMessage v-if="message.kind === 'user'" :text="message.text" />
      <AssistantMessage
        v-else-if="message.kind === 'assistant'"
        :text="message.text"
        :streaming="message.streaming"
      />
      <SystemMessage
        v-else-if="message.kind === 'system'"
        :text="message.text"
        :error="message.error"
      />
      <ThinkingIndicator v-else />
    </template>
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
