import { join } from 'path'

// Pasta onde o AgentCore guarda config e sessões. O Orbit define AGENTCORE_DATA_DIR (userData do app);
// o fallback só vale se o server for iniciado fora do Electron.
export const dataDir = process.env.AGENTCORE_DATA_DIR ?? join(process.cwd(), 'data')
