import { escapeHtml } from './text'

export type MarkdownBlock =
  { type: 'paragraph'; html: string } | { type: 'code'; lang: string; code: string }

export function formatInline(escaped: string): string {
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+?)`/g, '<code>$1</code>')
}

export function appendTextParagraphs(blocks: MarkdownBlock[], text: string): void {
  for (const raw of text.split(/\n{2,}/)) {
    const trimmed = raw.trim()
    if (!trimmed) continue

    blocks.push({
      type: 'paragraph',
      html: formatInline(escapeHtml(trimmed)).replace(/\n/g, '<br>')
    })
  }
}

export function renderMarkdownLite(text: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  const parts = text.split(/```([\w+#.-]*)\n([\s\S]*?)```/g)

  for (let i = 0; i < parts.length; i += 3) {
    const textChunk = parts[i]
    if (textChunk) appendTextParagraphs(blocks, textChunk)

    const lang = parts[i + 1]
    const code = parts[i + 2]
    if (code !== undefined) blocks.push({ type: 'code', lang: lang ?? '', code })
  }

  return blocks
}
