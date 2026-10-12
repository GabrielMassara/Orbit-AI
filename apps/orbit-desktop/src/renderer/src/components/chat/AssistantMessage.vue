<script setup lang="ts">
import { computed } from 'vue'
import logo from '../../assets/logo.png'
import { renderMarkdownLite } from '../../utils/markdown'
import CodeBlock from './CodeBlock.vue'
import FeedbackRow from './FeedbackRow.vue'

const props = defineProps<{ text: string; streaming?: boolean }>()

const blocks = computed(() => (props.streaming ? [] : renderMarkdownLite(props.text)))
</script>

<template>
  <div class="ai-message">
    <div class="ai-header">
      <img :src="logo" alt="OrbitAI" class="ai-avatar" />
      <span class="ai-name">OrbitAI</span>
    </div>

    <div class="ai-content">
      <p v-if="streaming">{{ text }}<span class="stream-cursor"></span></p>
      <template v-else>
        <template v-for="(block, index) in blocks" :key="index">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-if="block.type === 'paragraph'" v-html="block.html"></p>
          <CodeBlock v-else :lang="block.lang" :code="block.code" />
        </template>
        <FeedbackRow />
      </template>
    </div>
  </div>
</template>

<style scoped>
.ai-message {
  display: flex;
  flex-direction: column;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.ai-avatar {
  width: 22px;
  height: 22px;
  object-fit: contain;
  border-radius: 6px;
}

.ai-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}

.ai-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 20px;
  border-bottom-left-radius: 4px;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(20px) saturate(1.3);
  box-shadow: 0 4px 16px rgba(20, 40, 90, 0.06);
}

.ai-content p {
  font-size: 15px;
  line-height: 1.65;
  color: var(--text);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.ai-content p :deep(code) {
  padding: 2px 5px;
  border-radius: 5px;
  background: var(--surface-hover);
  font-size: 13px;
}

.stream-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  margin-left: 2px;
  background: var(--ink);
  vertical-align: middle;
  animation: blink 0.9s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
