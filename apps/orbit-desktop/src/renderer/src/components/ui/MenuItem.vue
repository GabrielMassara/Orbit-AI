<script setup lang="ts">
defineProps<{
  active?: boolean
  danger?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="menu-item"
    :class="{ 'menu-item--active': active, 'menu-item--danger': danger }"
    role="menuitem"
  >
    <span class="menu-item__content"><slot /></span>
  </button>
</template>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--ink-soft);
  font-size: 13px;
  font-weight: 600;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}

.menu-item:hover {
  background: var(--surface-hover);
}

.menu-item__content {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.menu-item__content :deep(svg) {
  flex-shrink: 0;
}

.menu-item--active {
  color: var(--accent);
}

.menu-item--active::after {
  content: '';
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  margin-left: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.menu-item--danger {
  color: var(--danger-text);
}

.menu-item--danger:hover {
  background: var(--danger-surface);
}
</style>
