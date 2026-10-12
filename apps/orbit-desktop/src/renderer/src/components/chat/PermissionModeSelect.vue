<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { appState } from '../../state/app-state'
import {
  availablePermissionModes,
  closeAllPermissionModeMenus,
  CODEX_SANDBOX_MODE_LABELS,
  CODEX_SANDBOX_MODES,
  codexSandboxIcon,
  handleCodexSandboxModeSelect,
  handlePermissionModeSelect,
  isCodexSession,
  PERMISSION_MODE_LABELS,
  permissionModeBusy,
  permissionModeIcon,
  permissionModeMenuOpen,
  togglePermissionModeMenu
} from '../../state/permission-mode'
import AppIcon from '../icons/AppIcon'
import MenuItem from '../ui/MenuItem.vue'
import MenuPanel from '../ui/MenuPanel.vue'

const root = ref<HTMLElement | null>(null)

function onDocumentClick(event: MouseEvent): void {
  if (!root.value?.contains(event.target as Node)) closeAllPermissionModeMenus()
}

function onEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') closeAllPermissionModeMenus()
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
  <div
    ref="root"
    class="permission-mode"
    :class="{ 'permission-mode--open': permissionModeMenuOpen }"
  >
    <button
      type="button"
      class="permission-mode__button"
      :aria-label="isCodexSession() ? 'Sandbox do Codex' : 'Permission mode'"
      :title="isCodexSession() ? 'Sandbox do Codex' : 'Permission mode'"
      aria-haspopup="menu"
      :aria-expanded="permissionModeMenuOpen"
      :disabled="!appState.session || permissionModeBusy"
      @click="togglePermissionModeMenu"
    >
      <template v-if="isCodexSession()">
        <AppIcon :name="codexSandboxIcon(appState.currentCodexSandboxMode)" :size="15" />
        <span>{{
          CODEX_SANDBOX_MODE_LABELS[appState.currentCodexSandboxMode] ??
          appState.currentCodexSandboxMode
        }}</span>
      </template>
      <template v-else>
        <AppIcon :name="permissionModeIcon(appState.currentPermissionMode)" :size="15" />
        <span>{{
          PERMISSION_MODE_LABELS[appState.currentPermissionMode] ?? appState.currentPermissionMode
        }}</span>
      </template>
    </button>

    <MenuPanel
      v-if="!isCodexSession()"
      :open="permissionModeMenuOpen"
      placement="top-end"
      :offset="10"
      :min-width="200"
    >
      <div class="permission-mode__title">Permission mode</div>
      <MenuItem
        v-for="mode in availablePermissionModes()"
        :key="mode"
        :active="mode === appState.currentPermissionMode"
        :disabled="permissionModeBusy"
        @click="handlePermissionModeSelect(mode)"
      >
        <AppIcon :name="permissionModeIcon(mode)" :size="15" />
        <span>{{ PERMISSION_MODE_LABELS[mode] }}</span>
      </MenuItem>
    </MenuPanel>

    <MenuPanel
      v-else
      :open="permissionModeMenuOpen"
      placement="top-end"
      :offset="10"
      :min-width="200"
    >
      <div class="permission-mode__title">Sandbox do Codex</div>
      <MenuItem
        v-for="mode in CODEX_SANDBOX_MODES"
        :key="mode"
        :active="mode === appState.currentCodexSandboxMode"
        :disabled="permissionModeBusy"
        @click="handleCodexSandboxModeSelect(mode)"
      >
        <AppIcon :name="codexSandboxIcon(mode)" :size="15" />
        <span>{{ CODEX_SANDBOX_MODE_LABELS[mode] }}</span>
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

.permission-mode__button:disabled {
  opacity: 0.6;
  cursor: default;
}

.permission-mode__button:hover:not(:disabled),
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
