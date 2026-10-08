<script setup lang="ts">
import AppIcon from '../icons/AppIcon'
import type { IconName } from '../icons/icons'
import MenuItem from '../ui/MenuItem.vue'
import MenuPanel from '../ui/MenuPanel.vue'

defineProps<{
  menuOpen?: 'claude' | 'codex'
}>()

interface Option {
  value: string
  label: string
  icon: IconName
}

const claudeModes: Option[] = [
  { value: 'default', label: 'Padrão', icon: 'shield-check' },
  { value: 'acceptEdits', label: 'Aceitar edições', icon: 'pencil' },
  { value: 'bypassPermissions', label: 'Ignorar permissões', icon: 'bolt' },
  { value: 'plan', label: 'Modo plano', icon: 'clipboard-list' },
  { value: 'dontAsk', label: 'Não perguntar', icon: 'bell-off' },
  { value: 'auto', label: 'Automático', icon: 'infinity' }
]

const codexSandboxModes: Option[] = [
  { value: 'read-only', label: 'Somente leitura', icon: 'eye' },
  { value: 'workspace-write', label: 'Workspace', icon: 'folder-edit' },
  { value: 'danger-full-access', label: 'Acesso total', icon: 'lock-open' }
]

const current = claudeModes[0]
</script>

<template>
  <div class="permission-mode" :class="{ 'permission-mode--open': menuOpen }">
    <button
      type="button"
      class="permission-mode__button"
      aria-label="Permission mode"
      title="Permission mode"
    >
      <AppIcon :name="current.icon" :size="15" />
      <span>{{ current.label }}</span>
    </button>

    <MenuPanel :open="menuOpen === 'claude'" placement="top-end" :offset="10" :min-width="200">
      <div class="permission-mode__title">Permission mode</div>
      <MenuItem v-for="mode in claudeModes" :key="mode.value" :active="mode === current">
        <AppIcon :name="mode.icon" :size="15" /><span>{{ mode.label }}</span>
      </MenuItem>
    </MenuPanel>

    <MenuPanel :open="menuOpen === 'codex'" placement="top-end" :offset="10" :min-width="200">
      <div class="permission-mode__title">Sandbox do Codex</div>
      <MenuItem v-for="mode in codexSandboxModes" :key="mode.value">
        <AppIcon :name="mode.icon" :size="15" /><span>{{ mode.label }}</span>
      </MenuItem>
    </MenuPanel>
  </div>
</template>

<style scoped>
.permission-mode {
  position: relative;
  flex-shrink: 0;
}

.permission-mode__button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px 0 10px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--text-ghost);
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.permission-mode__button svg {
  flex-shrink: 0;
}

.permission-mode__button:hover,
.permission-mode--open .permission-mode__button {
  background: var(--surface-hover);
  color: var(--text-muted);
}

.permission-mode__title {
  padding: 6px 10px 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--text-faint);
}
</style>
