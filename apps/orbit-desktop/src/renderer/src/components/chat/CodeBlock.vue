<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { mountCodeEditor } from '../../lib/monaco'

const props = defineProps<{ lang: string; code: string }>()

const COPIED_RESET_MS = 2000

const host = ref<HTMLElement | null>(null)
const copied = ref(false)
const fallback = ref(false)

const provisionalHeight = Math.min(480, Math.max(48, props.code.split('\n').length * 19 + 20))

let disposeEditor: (() => void) | null = null
let disposed = false
let copiedTimer: ReturnType<typeof setTimeout> | undefined

onMounted(async () => {
  if (!host.value) return
  try {
    const editor = await mountCodeEditor(host.value, props.lang, props.code)
    if (disposed) editor.dispose()
    else disposeEditor = () => editor.dispose()
  } catch (err) {
    console.warn('Monaco indisponível, mostrando código sem editor.', err)
    fallback.value = true
  }
})

onBeforeUnmount(() => {
  disposed = true
  clearTimeout(copiedTimer)
  disposeEditor?.()
})

async function copy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    return
  }
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), COPIED_RESET_MS)
}
</script>

<template>
  <div class="code-block">
    <div class="code-header">
      <span class="code-lang">{{ lang || 'text' }}</span>
      <button type="button" class="copy-btn" :class="{ copied }" @click="copy">
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <pre v-if="fallback" class="code-editor code-editor--fallback">{{ code }}</pre>
    <div v-else ref="host" class="code-editor" :style="{ height: `${provisionalHeight}px` }"></div>
  </div>
</template>

<style scoped>
.code-block {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 0;
  background: #0f1117;
}

.code-lang {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #4a5578;
}

.copy-btn {
  padding: 2px 6px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #4a5578;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  opacity: 0;
  transition:
    color 0.15s ease,
    background 0.15s ease,
    opacity 0.15s ease;
}

.code-block:hover .copy-btn,
.copy-btn:focus-visible {
  opacity: 1;
}

.copy-btn:hover {
  color: #c9d3ea;
  background: rgba(255, 255, 255, 0.06);
}

.copy-btn.copied {
  color: #1fb894;
  opacity: 1;
}

.code-editor {
  width: 100%;
  background: #0f1117;
}

.code-editor--fallback {
  margin: 0;
  padding: 16px;
  color: #c9d3ea;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-x: auto;
}
</style>
