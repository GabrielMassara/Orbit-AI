import { ref } from 'vue'

export const SIDEBAR_MIN_WIDTH = 220
export const SIDEBAR_MAX_WIDTH = 480
export const SIDEBAR_DEFAULT_WIDTH = 300

const STORAGE_KEY = 'orbit.sidebar-width'
const KEY_STEP = 16
const KEY_STEP_LARGE = 48

const clamp = (value: number): number =>
  Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, Math.round(value)))

function load(): number {
  try {
    const stored = Number(localStorage.getItem(STORAGE_KEY))
    return stored > 0 ? clamp(stored) : SIDEBAR_DEFAULT_WIDTH
  } catch {
    return SIDEBAR_DEFAULT_WIDTH
  }
}

function save(width: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(width))
  } catch {}
}

export function useSidebarWidth() {
  const width = ref(load())
  const resizing = ref(false)

  function set(next: number): void {
    width.value = clamp(next)
    save(width.value)
  }

  function onPointerDown(event: PointerEvent): void {
    const handle = event.currentTarget as HTMLElement
    const sidebarLeft = handle.parentElement?.getBoundingClientRect().left ?? 0

    event.preventDefault()
    handle.setPointerCapture(event.pointerId)
    resizing.value = true

    const onMove = (e: PointerEvent): void => {
      width.value = clamp(e.clientX - sidebarLeft)
    }
    const onEnd = (): void => {
      resizing.value = false
      save(width.value)
      handle.removeEventListener('pointermove', onMove)
      handle.removeEventListener('pointerup', onEnd)
      handle.removeEventListener('pointercancel', onEnd)
    }

    handle.addEventListener('pointermove', onMove)
    handle.addEventListener('pointerup', onEnd)
    handle.addEventListener('pointercancel', onEnd)
  }

  function onKeydown(event: KeyboardEvent): void {
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP
    const targets: Record<string, number> = {
      ArrowLeft: width.value - step,
      ArrowRight: width.value + step,
      Home: SIDEBAR_MIN_WIDTH,
      End: SIDEBAR_MAX_WIDTH
    }

    if (!(event.key in targets)) return
    event.preventDefault()
    set(targets[event.key])
  }

  function reset(): void {
    set(SIDEBAR_DEFAULT_WIDTH)
  }

  return { width, resizing, onPointerDown, onKeydown, reset }
}
