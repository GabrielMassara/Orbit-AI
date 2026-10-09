import Fastify from 'fastify'
import cors from '@fastify/cors'
import healthRoutes from './routes/health'
import sessionRoutes from './routes/sessions.routes'
import configRoutes from './routes/config.routes'
import { corsEnabled, isOriginAllowed } from './config/cors'
import { closeOpenCodeServer } from './runtimes/opencode/opencode.runtime'

const server = Fastify({ logger: true })

if (corsEnabled) {
  server.register(cors, {
    origin: (origin, callback) => callback(null, !origin || isOriginAllowed(origin)),
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'PUT']
  })
}

server.register(healthRoutes)
server.register(sessionRoutes)
server.register(configRoutes)

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.AGENTCORE_PORT) || 3000, host: '127.0.0.1' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()

// Sem isso, o processo `opencode serve` que OpenCodeRuntime sobe (ver getDefaultServer) fica
// órfão a cada restart do Adapter em desenvolvimento
async function shutdown() {
  server.log.info('Shutting down: closing OpenCode server, if any...')

  try {
    await closeOpenCodeServer()
  } catch (err) {
    server.log.error(err, 'shutdown: failed to close OpenCode server')
  }

  server.log.info('OpenCode server closed, closing Fastify...')
  await server.close()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

// Quando roda como utilityProcess do Electron o main avisa o fim por aqui: no Windows não existe
// SIGTERM entre processos, então disparamos o mesmo handler.
process.parentPort?.on('message', (event) => {
  if (event.data === 'shutdown') void shutdown()
})
