<script setup lang="ts">
import AppIcon from '../icons/AppIcon'
import MenuItem from '../ui/MenuItem.vue'
import MenuPanel from '../ui/MenuPanel.vue'

defineProps<{
  label: string
  active?: boolean
  forked?: boolean
  tag?: string
  menuOpen?: boolean
}>()
</script>

<template>
  <div class="recent-item" :class="{ 'recent-item--active': active }">
    <button type="button" class="recent-item__main">
      <span v-if="forked" class="recent-item__fork" title="Ramificada de outra conversa">
        <AppIcon name="fork" :size="13" />
      </span>
      <span class="recent-item__label">{{ label }}</span>
      <span v-if="tag" class="recent-item__tag" :title="`Tag: ${tag}`" />
    </button>

    <div class="recent-item__more" :class="{ 'recent-item__more--open': menuOpen }">
      <button type="button" class="recent-item__more-btn" aria-label="Mais opções">
        <AppIcon name="more" :size="16" />
      </button>
      <MenuPanel :open="menuOpen" :offset="4" style="right: 6px">
        <MenuItem><AppIcon name="pencil" :size="15" /><span>Renomear</span></MenuItem>
        <MenuItem>
          <AppIcon name="tag" :size="15" /><span>{{ tag ? 'Editar tag' : 'Marcar tag' }}</span>
        </MenuItem>
        <MenuItem danger><AppIcon name="trash" :size="15" /><span>Excluir</span></MenuItem>
      </MenuPanel>
    </div>
  </div>
</template>

<style scoped>
.recent-item {
  display: flex;
  align-items: center;
  gap: 2px;
  width: 100%;
  border-radius: 10px;
  transition: background 0.15s ease;
}

.recent-item:hover {
  background: var(--glass-bg);
}

.recent-item--active {
  background: rgba(255, 255, 255, 0.55);
}

.recent-item__main {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  padding: 11px 12px;
  cursor: pointer;
  text-align: left;
}

.recent-item--active .recent-item__main {
  color: var(--ink);
  font-weight: 600;
}

.recent-item__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-item__fork {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  color: var(--accent-light);
}

.recent-item__tag {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--warning);
  box-shadow: 0 0 0 2px rgba(245, 165, 36, 0.22);
}

.recent-item__more {
  position: relative;
  flex-shrink: 0;
}

.recent-item__more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-right: 6px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--text-ghost);
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 0.15s ease,
    background 0.15s ease,
    color 0.15s ease;
}

.recent-item:hover .recent-item__more-btn,
.recent-item__more--open .recent-item__more-btn {
  opacity: 1;
}

.recent-item__more-btn:hover,
.recent-item__more--open .recent-item__more-btn {
  background: var(--surface-hover);
  color: var(--text-muted);
}
</style>
