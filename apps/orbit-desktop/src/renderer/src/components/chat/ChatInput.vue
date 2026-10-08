<script setup lang="ts">
import AppIcon from '../icons/AppIcon'
import IconButton from '../ui/IconButton.vue'
import PermissionModeSelect from './PermissionModeSelect.vue'

defineProps<{ running?: boolean }>()
</script>

<template>
  <footer class="input-area">
    <div class="input-row">
      <IconButton label="Attachments" size="lg" title="Anexar arquivo ou imagem">
        <AppIcon name="paperclip" />
      </IconButton>

      <div class="input-bar">
        <input
          type="text"
          class="input-bar__field"
          placeholder="Ask anything..."
          autocomplete="off"
        />
        <div class="input-bar__actions">
          <PermissionModeSelect />
          <button
            type="button"
            class="send-button"
            :class="{ 'send-button--stop': running }"
            :aria-label="running ? 'Stop' : 'Send'"
          >
            <AppIcon v-if="running" name="stop" :size="16" />
            <AppIcon v-else name="arrow-up" :stroke-width="2" />
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.input-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 10px var(--content-gutter) clamp(24px, 5vh, 40px);
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-bar {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 8px 20px;
  border-radius: 999px;
  background: var(--surface);
  box-shadow: 0 4px 18px rgba(20, 40, 90, 0.09);
}

.input-bar__field {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--ink);
  font-size: 15px;
  outline: none;
}

.input-bar__field::placeholder {
  color: var(--text-ghost);
}

.input-bar__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.send-button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: var(--ink);
  color: #ffffff;
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.15s ease;
}

.send-button:hover {
  background: #262b38;
}

.send-button:active {
  transform: scale(0.94);
}

.send-button--stop {
  background: var(--danger);
}

.send-button--stop:hover {
  background: #c93f43;
}
</style>
