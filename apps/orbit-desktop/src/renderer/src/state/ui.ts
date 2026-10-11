import { ref } from 'vue'

export const sidebarOpen = ref(false)

export function toggleSidebar(): void {
  sidebarOpen.value = !sidebarOpen.value
}

export function closeSidebarOnMobile(): void {
  sidebarOpen.value = false
}
