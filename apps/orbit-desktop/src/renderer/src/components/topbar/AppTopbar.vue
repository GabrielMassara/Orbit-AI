<script setup lang="ts">
import AppIcon from '../icons/AppIcon'
import IconButton from '../ui/IconButton.vue'
import ModelSelect from './ModelSelect.vue'
</script>

<template>
  <header class="topbar">
    <ModelSelect />

    <div class="topbar__actions">
      <IconButton label="Toggle sidebar" class="topbar__sidebar-toggle">
        <AppIcon name="sidebar" />
      </IconButton>
      <IconButton label="New chat">
        <AppIcon name="plus" :stroke-width="2" />
      </IconButton>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 24px var(--content-gutter) 0;
}

.topbar__actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar__actions .topbar__sidebar-toggle {
  display: none;
}

@media (max-width: 860px) {
  .topbar__actions .topbar__sidebar-toggle {
    display: flex;
  }
}
</style>
