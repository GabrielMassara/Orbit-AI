<template>
  <div class="thinking-indicator" role="status" aria-label="Pensando">
    <span class="thinking-dot"></span>
    <span class="thinking-dot"></span>
    <span class="thinking-dot"></span>
  </div>
</template>

<style scoped>
.thinking-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  align-self: flex-start;
  padding: 13px 16px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;
  background: var(--glass-bg);
  backdrop-filter: blur(14px);
  box-shadow: 0 2px 8px rgba(20, 40, 90, 0.05);
}

.thinking-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-faint);
  animation: thinking-bounce 1.1s ease-in-out infinite;
}

.thinking-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.thinking-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes thinking-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
</style>
