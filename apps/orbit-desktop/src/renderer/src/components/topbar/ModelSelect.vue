<script setup lang="ts">
import AppIcon from '../icons/AppIcon'
import ProviderIcon, { type Runtime } from '../icons/ProviderIcon.vue'
import MenuItem from '../ui/MenuItem.vue'
import MenuPanel from '../ui/MenuPanel.vue'

defineProps<{ menuOpen?: boolean }>()

const agents: { runtime: Runtime; label: string; models: { id: string; label: string }[] }[] = [
  { runtime: 'claude', label: 'Claude', models: [{ id: '', label: 'Padrão do CLI' }] },
  { runtime: 'codex', label: 'Codex', models: [{ id: '', label: 'Padrão do CLI' }] },
  { runtime: 'opencode', label: 'OpenCode', models: [{ id: '', label: 'Padrão do CLI' }] }
]
</script>

<template>
  <div class="model-select">
    <button
      type="button"
      class="model-select__button"
      aria-label="Provedor e modelo"
      title="Provedor e modelo"
    >
      <ProviderIcon runtime="claude" :size="15" />
      <span class="model-select__label">Modelo</span>
      <AppIcon name="chevron-down" :size="14" :stroke-width="2" class="model-select__chevron" />
    </button>

    <MenuPanel
      :open="menuOpen"
      placement="bottom-start"
      :min-width="230"
      class="model-select__menu"
    >
      <template v-for="agent in agents" :key="agent.runtime">
        <div class="model-select__section">
          <ProviderIcon :runtime="agent.runtime" variant="brand" :size="14" />
          <span>{{ agent.label }}</span>
        </div>
        <MenuItem
          v-for="model in agent.models"
          :key="model.id"
          :active="agent.runtime === 'claude'"
        >
          <ProviderIcon :runtime="agent.runtime" :size="15" />
          <span>{{ model.label }}</span>
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

.model-select__button:hover {
  box-shadow: 0 4px 10px rgba(20, 23, 31, 0.12);
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
