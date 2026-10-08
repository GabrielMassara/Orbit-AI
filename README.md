<div align="center">

<img src="apps/orbit-desktop/src/renderer/src/assets/logo.png" alt="Orbit AI" width="140" />

# Orbit AI

**Gerenciamento centralizado de agentes de IA locais em um único aplicativo desktop.**

![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

![Claude Code](https://img.shields.io/badge/Claude_Code-D97757?style=for-the-badge&logo=anthropic&logoColor=white)
![Codex](https://img.shields.io/badge/Codex-000000?style=for-the-badge)
![OpenCode](https://img.shields.io/badge/OpenCode-000000?style=for-the-badge&logo=opencode&logoColor=white)

</div>

---

## O que é

O **Orbit AI** é um aplicativo desktop para gerenciar, em um só lugar, os agentes de IA de codificação que rodam na sua máquina, como Claude Code, Codex e OpenCode. Em vez de alternar entre ferramentas com interfaces e formatos de sessão diferentes, você conversa com todos eles pela mesma interface.

## AgentCore

Quem conversa com os agentes de IA é o **[AgentCore](https://gabrielmassara.com/projetos/AgentCore/)**, uma API HTTP local que expõe Claude Code, Codex e OpenCode por trás de um único contrato HTTP e SSE. O cliente cria sessões, envia mensagens e escuta eventos sempre da mesma forma, não importa qual agente está processando por baixo. O site e a documentação completa estão em [gabrielmassara.com/projetos/AgentCore](https://gabrielmassara.com/projetos/AgentCore/).

No Orbit AI o AgentCore faz parte do próprio projeto (`apps/orbit-desktop/src/main/agentcore`) e não precisa ser instalado ou iniciado à parte:
