const isDev = process.env.NODE_ENV !== 'production'

const allowedOrigins = (process.env.AGENTCORE_CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const corsEnabled = isDev || allowedOrigins.length > 0

export function isOriginAllowed(origin: string | undefined): origin is string {
  if (!origin) return false
  return isDev || allowedOrigins.includes(origin)
}
