<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    size?: 'md' | 'lg'
  }>(),
  { size: 'md' }
)
</script>

<template>
  <button type="button" class="icon-button" :class="`icon-button--${size}`" :aria-label="label">
    <slot />
  </button>
</template>

<style scoped>
.icon-button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  color: var(--ink);
  cursor: pointer;
  box-shadow: var(--shadow-control);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}

.icon-button--md {
  width: 38px;
  height: 38px;
}

.icon-button--lg {
  width: 44px;
  height: 44px;
  color: var(--text-muted);
}

.icon-button:hover {
  background: var(--glass-bg-hover);
  box-shadow: var(--shadow-control-hover);
}

.icon-button:active {
  transform: scale(0.94);
}
</style>
