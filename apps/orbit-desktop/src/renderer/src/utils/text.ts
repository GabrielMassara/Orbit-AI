export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function formatRelativeTime(dateInput: string | number | Date): string {
  const diffMs = Date.now() - new Date(dateInput).getTime()
  const diffMin = Math.round(diffMs / 60000)

  if (diffMin < 1) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} min`

  const diffHours = Math.round(diffMin / 60)
  if (diffHours < 24) return `há ${diffHours}h`

  return `há ${Math.round(diffHours / 24)}d`
}
