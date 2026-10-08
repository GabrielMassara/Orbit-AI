import { mkdirSync } from 'node:fs'
import { createServer } from 'node:net'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { app, utilityProcess, type UtilityProcess } from 'electron'

const HEALTH_TIMEOUT_MS = 30_000
const SHUTDOWN_TIMEOUT_MS = 5_000

let child: UtilityProcess | null = null
let baseUrl: string | null = null

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer()
    probe.once('error', reject)
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address() as { port: number }
      probe.close(() => resolve(port))
    })
  })
}

async function waitForHealth(url: string, exited: Promise<never>): Promise<void> {
  const deadline = Date.now() + HEALTH_TIMEOUT_MS
  while (Date.now() < deadline) {
    try {
      const res = await Promise.race([fetch(`${url}/health`), exited])
      if (res.ok) return
    } catch {}
    await Promise.race([delay(200), exited])
  }
  throw new Error('AgentCore não respondeu a tempo')
}

export function getAgentCoreUrl(): string | null {
  return baseUrl
}

export async function startAgentCore(): Promise<void> {
  const port = await freePort()
  const url = `http://127.0.0.1:${port}`
  const dataDir = join(app.getPath('userData'), 'agentcore')
  mkdirSync(dataDir, { recursive: true })

  const proc = utilityProcess.fork(join(__dirname, 'agentcore.js'), [], {
    cwd: dataDir,
    stdio: 'pipe',
    serviceName: 'agentcore',
    env: {
      ...process.env,
      AGENTCORE_PORT: String(port),
      AGENTCORE_DATA_DIR: dataDir,
      NODE_ENV: app.isPackaged ? 'production' : 'development'
    }
  })
  child = proc

  let stderrTail = ''
  proc.stdout?.on('data', (chunk: Buffer) => process.stdout.write(`[agentcore] ${chunk}`))
  proc.stderr?.on('data', (chunk: Buffer) => {
    stderrTail = (stderrTail + chunk.toString()).slice(-2000)
    process.stderr.write(`[agentcore] ${chunk}`)
  })

  const exited = new Promise<never>((_, reject) => {
    proc.once('exit', (code) => {
      if (child === proc) child = null
      reject(new Error(`AgentCore encerrou (código ${code}).\n${stderrTail}`.trim()))
    })
  })
  exited.catch(() => {})

  await waitForHealth(url, exited)
  baseUrl = url
}

export async function stopAgentCore(): Promise<void> {
  const proc = child
  if (!proc) return
  child = null
  baseUrl = null

  const closed = new Promise<void>((resolve) => proc.once('exit', () => resolve()))
  proc.postMessage('shutdown')
  const result = await Promise.race([
    closed.then(() => 'closed'),
    delay(SHUTDOWN_TIMEOUT_MS, 'timeout')
  ])
  if (result === 'timeout') proc.kill()
}
