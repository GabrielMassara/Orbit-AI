<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <div class="user-message">
    <p>{{ text }}</p>
  </div>
</template>

<style scoped>
.user-message {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-message p {
  max-width: 85%;
  padding: 13px 17px;
  border-radius: 20px;
  border-bottom-right-radius: 4px;
  background: var(--ink);
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
