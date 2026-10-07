import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import eslintPluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  { ignores: ['**/node_modules', '**/out', '**/release'] },
  eslintPluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  skipFormatting
)
