<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import logo from '../../assets/logo.png'
import {
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  useSidebarWidth
} from '../../composables/useSidebarWidth'
import { appState } from '../../state/app-state'
import {
  handleDeleteSession,
  handleRenameSession,
  handleTagSession,
  newChat,
  recentSessions,
  sessionLabel,
  switchSession
} from '../../state/sessions'
import { sidebarOpen } from '../../state/ui'
import AppIcon from '../icons/AppIcon'
import RecentItem from './RecentItem.vue'

const { width, resizing, onPointerDown, onKeydown, reset } = useSidebarWidth()

const openMenuId = ref<string | null>(null)

function toggleMenu(sessionId: string): void {
  openMenuId.value = openMenuId.value === sessionId ? null : sessionId
}

function closeMenus(): void {
  openMenuId.value = null
}

function onEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') closeMenus()
}

onMounted(() => {
  document.addEventListener('click', closeMenus)
  document.addEventListener('keydown', onEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenus)
  document.removeEventListener('keydown', onEscape)
})

const user = { name: 'Usuário Teste', initials: 'UT' }
</script>

<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar--open': sidebarOpen, 'sidebar--resizing': resizing }"
    :style="{ '--sidebar-width': `${width}px` }"
  >
    <div class="brand">
      <img :src="logo" alt="" class="brand__logo" />
      <span class="brand__name">OrbitAI</span>
    </div>

    <button type="button" class="new-conversation" @click="newChat">
      <AppIcon name="plus" :size="18" :stroke-width="2" />
      New conversation
    </button>

    <div class="recent">
      <span class="recent__label">Recent</span>
      <div class="recent__list">
        <p v-if="recentSessions.length === 0" class="recent__empty">Nenhuma conversa ainda.</p>
        <RecentItem
          v-for="session in recentSessions"
          :key="session.id"
          :label="sessionLabel(session)"
          :active="session.id === appState.session?.id"
          :forked="!!session.forkedFrom"
          :tag="session.tag"
          :menu-open="openMenuId === session.id"
          @select="switchSession(session.id)"
          @toggle-menu="toggleMenu(session.id)"
          @rename="handleRenameSession(session.id, sessionLabel(session))"
          @tag="handleTagSession(session.id, session.tag)"
          @delete="handleDeleteSession(session.id)"
        />
      </div>
    </div>

    <div class="sidebar__footer">
      <div class="user-chip">
        <span class="user-chip__avatar">{{ user.initials }}</span>
        <span class="user-chip__name">{{ user.name }}</span>
      </div>
    </div>

    <div
      class="sidebar__resizer"
      role="separator"
      aria-orientation="vertical"
      aria-label="Redimensionar barra lateral"
      :aria-valuenow="width"
      :aria-valuemin="SIDEBAR_MIN_WIDTH"
      :aria-valuemax="SIDEBAR_MAX_WIDTH"
      tabindex="0"
      title="Arraste para redimensionar (duplo clique restaura)"
      @pointerdown="onPointerDown"
      @keydown="onKeydown"
      @dblclick="reset"
    />
  </aside>
</template>

<style scoped>
.sidebar {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  height: 100%;
  padding: 24px 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(28px) saturate(1.4);
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  transition: margin-left 0.25s ease;
}

.brand {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px 24px;
}

.brand__logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  border-radius: 7px;
}

.brand__name {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.1px;
}

.new-conversation {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 13px 16px;
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.15s ease;
}

.new-conversation:hover {
  background: var(--glass-bg-hover);
}

.new-conversation:active {
  transform: scale(0.98);
}

.recent {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-top: 26px;
}

.recent__label {
  flex-shrink: 0;
  margin-bottom: 8px;
  padding: 0 6px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.recent__list {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.recent__empty {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-ghost);
}

.sidebar__footer {
  flex-shrink: 0;
  padding-top: 16px;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 6px;
  border-radius: 12px;
}

.user-chip__avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-gradient);
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
}

.user-chip__name {
  font-size: 14px;
  font-weight: 600;
}

.sidebar__resizer {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 5;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  touch-action: none;
  outline: none;
}

.sidebar__resizer::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 2px;
  height: 100%;
  background: var(--accent-light);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.sidebar__resizer:hover::after,
.sidebar__resizer:focus-visible::after,
.sidebar--resizing .sidebar__resizer::after {
  opacity: 0.7;
}

@media (max-width: 860px) {
  .sidebar {
    position: fixed;
    z-index: 90;
    top: 0;
    left: 0;
    margin-left: calc(-1 * var(--sidebar-width));
  }

  .sidebar--open {
    margin-left: 0;
    box-shadow: 12px 0 32px rgba(20, 40, 90, 0.15);
  }

  .sidebar__resizer {
    display: none;
  }
}
</style>
