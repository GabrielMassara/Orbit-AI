
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

let baseUrlPromise: Promise<string> | null = null

export function getApiBaseUrl(): Promise<string> {
  if (!baseUrlPromise) {
    baseUrlPromise = window.orbit.getApiBaseUrl().catch((error) => {
      baseUrlPromise = null
      throw error
    })
  }
  return baseUrlPromise
}

export async function apiUrl(path: string): Promise<string> {
  return `${await getApiBaseUrl()}${path}`
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  failureMessage: string
}

export async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const { method = 'GET', body, failureMessage } = options

  const res = await fetch(await apiUrl(path), {
    method,
    ...(body !== undefined
      ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      : {})
  })

  if (!res.ok) {
    const payload = (await res.json().catch(() => ({}))) as { error?: string }
    throw new ApiError(payload.error || `${failureMessage} (${res.status})`, res.status)
  }

  return (await res.json()) as T
}

export async function requestOr<T>(path: string, fallback: T): Promise<T> {
  try {
    return await request<T>(path, { failureMessage: '' })
  } catch {
    return fallback
  }
}
