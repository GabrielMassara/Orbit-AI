<script setup lang="ts">
import { computed } from 'vue'
import type { TodoItemStatus } from '../../api/types'
import AppIcon from '../icons/AppIcon'

const props = defineProps<{ items: { text: string; status: TodoItemStatus }[] }>()

const completedCount = computed(() => props.items.filter((i) => i.status === 'completed').length)
</script>

<template>
  <div class="todo-list">
    <div class="todo-list__header">
      <AppIcon name="list-bullets" :size="14" class="todo-list__icon" />
      <span class="todo-list__title">Plano</span>
      <span class="todo-list__progress">{{ completedCount }}/{{ items.length }}</span>
    </div>

    <ul class="todo-list__items">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="todo-list__item"
        :class="`todo-list__item--${item.status}`"
      >
        <span class="todo-list__check">
          <AppIcon v-if="item.status === 'completed'" name="check" :size="11" :stroke-width="2.4" />
        </span>
        <span class="todo-list__text">{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.todo-list {
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 85%;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(16px);
  box-shadow: 0 2px 10px rgba(20, 40, 90, 0.06);
}

.todo-list__header {
  display: flex;
  align-items: center;
  gap: 7px;
}

.todo-list__icon {
  color: var(--text-muted);
}

.todo-list__title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink);
}

.todo-list__progress {
  margin-left: auto;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-faint);
}

.todo-list__items {
  display: flex;
  flex-direction: column;
  gap: 7px;
  list-style: none;
}

.todo-list__item {
  display: flex;
  align-items: flex-start;
  gap: 9px;
}

.todo-list__check {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  border: 1.5px solid #c7cddb;
  border-radius: 50%;
  color: #fff;
}

.todo-list__item--completed .todo-list__check {
  border-color: #1fb894;
  background: #1fb894;
}

.todo-list__item--in_progress .todo-list__check {
  border-color: var(--warning);
  background: var(--warning);
  animation: pulse 1.2s ease-in-out infinite;
}

.todo-list__text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text);
}

.todo-list__item--completed .todo-list__text {
  color: var(--text-faint);
  text-decoration: line-through;
}

.todo-list__item--in_progress .todo-list__text {
  color: var(--ink);
  font-weight: 600;
}
</style>
