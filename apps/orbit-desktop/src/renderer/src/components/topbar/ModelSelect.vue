<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { appState } from '../../state/app-state'
import {
  closeModelMenu,
  DEFAULT_MODEL_LABEL,
  handleModelSelect,
  modelDisplayName,
  modelMenuBusy,
  modelMenuOpen,
  providerLabel,
  toggleModelMenu
} from '../../state/models'
import AppIcon from '../icons/AppIcon'
import ProviderIcon from '../icons/ProviderIcon.vue'
import MenuItem from '../ui/MenuItem.vue'
import MenuPanel from '../ui/MenuPanel.vue'

const root = ref<HTMLElement | null>(null)

function onDocumentClick(event: MouseEvent): void {
  if (!root.value?.contains(event.target as Node)) closeModelMenu()
}

function onEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') closeModelMenu()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onEscape)
})
</script>

<template>
  <div ref="root" class="model-select">
    <button
      type="button"
      class="model-select__button"
      aria-label="Provedor e modelo"
      title="Provedor e modelo"
      aria-haspopup="menu"
      :aria-expanded="modelMenuOpen"
      :disabled="!appState.session || modelMenuBusy"
      @click="toggleModelMenu"
    >
      <ProviderIcon :runtime="appState.currentRuntime" :size="16" />
      <span class="model-select__label">
        {{ modelDisplayName(appState.currentRuntime, appState.currentModel) }}
      </span>
      <AppIcon name="chevron-down" :size="14" :stroke-width="2" class="model-select__chevron" />
    </button>

    <MenuPanel
      :open="modelMenuOpen"
      placement="bottom-start"
      :min-width="230"
      class="model-select__menu"
    >
      <template v-for="agent in appState.availableAgents" :key="agent.runtime">
        <div class="model-select__section">
          <ProviderIcon :runtime="agent.runtime" variant="brand" :size="14" />
          <span>{{ providerLabel(agent.runtime) }}</span>
        </div>
        <MenuItem
          v-for="model in [{ id: '', displayName: DEFAULT_MODEL_LABEL }, ...agent.models]"
          :key="model.id"
          :active="agent.runtime === appState.currentRuntime && model.id === appState.currentModel"
          :disabled="modelMenuBusy"
          :title="'description' in model ? model.description : undefined"
          @click="handleModelSelect(agent.runtime, model.id)"
        >
          <ProviderIcon :runtime="agent.runtime" :size="15" />
          <span>{{ model.displayName }}</span>
        </MenuItem>
      </template>
    </MenuPanel>
  </div>
</template>

<style scoped>
.model-select {
  position: relative;
  min-width: 0;
  max-width: 60%;
}

.model-select__button {
  display: flex;
  align-items: center;
  gap: 9px;
  max-width: 100%;
  padding: 10px 16px;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-control);
  transition:
    box-shadow 0.15s ease,
    background 0.15s ease;
}

.model-select__button:hover:not(:disabled) {
  box-shadow: 0 4px 10px rgba(20, 23, 31, 0.12);
}

.model-select__button:disabled {
  opacity: 0.6;
  cursor: default;
}

.model-select__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-select__chevron {
  flex-shrink: 0;
  color: #c2c8d6;
}

.model-select__menu {
  max-height: min(60vh, 420px);
  overflow-y: auto;
}

.model-select__section {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  color: #7a8296;
}

.model-select__section:not(:first-child) {
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid rgba(20, 23, 31, 0.08);
}

.model-select__section :deep(svg) {
  flex-shrink: 0;
}
</style>
