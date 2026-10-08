<script setup lang="ts">
withDefaults(
  defineProps<{
    open?: boolean
    placement?: 'bottom-start' | 'bottom-end' | 'top-end'
    offset?: number
    minWidth?: number
  }>(),
  { open: false, placement: 'bottom-end', offset: 8, minWidth: 170 }
)
</script>

<template>
  <div
    class="menu-panel"
    :class="[`menu-panel--${placement}`, { 'menu-panel--open': open }]"
    :style="{ '--menu-offset': `${offset}px`, minWidth: `${minWidth}px` }"
    role="menu"
  >
    <slot />
  </div>
</template>

<style scoped>
.menu-panel {
  position: absolute;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 12px 28px rgba(20, 23, 31, 0.18);
  border-radius: 12px;
  padding: 6px;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    visibility 0.15s;
}

.menu-panel--bottom-start,
.menu-panel--bottom-end {
  top: calc(100% + var(--menu-offset));
  transform: translateY(-4px);
}

.menu-panel--bottom-start {
  left: 0;
}

.menu-panel--bottom-end {
  right: 0;
}

.menu-panel--top-end {
  bottom: calc(100% + var(--menu-offset));
  right: 0;
  transform: translateY(4px);
}

.menu-panel--open {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
</style>
