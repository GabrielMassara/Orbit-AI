import type * as Monaco from 'monaco-editor'

export const MONACO_THEME = 'orbitai-dark'

const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  rb: 'ruby',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  yml: 'yaml',
  md: 'markdown',
  cs: 'csharp',
  ps1: 'powershell',
  jsonc: 'json'
}

export function monacoLanguageFor(lang: string): string {
  if (!lang) return 'plaintext'
  const normalized = lang.toLowerCase()
  return LANGUAGE_ALIASES[normalized] ?? normalized
}

const basicLanguageContributions = import.meta.glob(
  '/node_modules/monaco-editor/esm/vs/basic-languages/*/*.contribution.js'
)

let monacoPromise: Promise<typeof Monaco> | null = null

export function loadMonaco(): Promise<typeof Monaco> {
  monacoPromise ??= (async () => {
    const [monaco, { default: EditorWorker }, { default: JsonWorker }] = await Promise.all([
      import('monaco-editor/esm/vs/editor/editor.api.js'),
      import('monaco-editor/esm/vs/editor/editor.worker.js?worker'),
      import('monaco-editor/esm/vs/language/json/json.worker.js?worker'),
      import('monaco-editor/esm/vs/language/json/monaco.contribution.js'),
      ...Object.values(basicLanguageContributions).map((load) => load())
    ])

    self.MonacoEnvironment = {
      getWorker: (_workerId, label) => (label === 'json' ? new JsonWorker() : new EditorWorker())
    }

    monaco.editor.defineTheme(MONACO_THEME, {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0f1117',
        'editor.lineHighlightBackground': '#0f1117',
        'editorLineNumber.foreground': '#3a4257',
        'editorLineNumber.activeForeground': '#6b7699',
        'editor.inactiveSelectionBackground': '#1a1e2c',
        'scrollbarSlider.background': '#ffffff14',
        'scrollbarSlider.hoverBackground': '#ffffff22'
      }
    })

    return monaco
  })()

  monacoPromise.catch(() => {
    monacoPromise = null
  })

  return monacoPromise
}

const MAX_HEIGHT = 480

export async function mountCodeEditor(
  host: HTMLElement,
  lang: string,
  code: string
): Promise<Monaco.editor.IStandaloneCodeEditor> {
  const monaco = await loadMonaco()

  const editor = monaco.editor.create(host, {
    value: code,
    language: monacoLanguageFor(lang),
    theme: MONACO_THEME,
    readOnly: true,
    domReadOnly: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: '"SF Mono", Menlo, Consolas, monospace',
    renderLineHighlight: 'none',
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    contextmenu: false,
    padding: { top: 12, bottom: 12 },
    scrollbar: { alwaysConsumeMouseWheel: false }
  })

  const resizeToContent = (): void => {
    host.style.height = `${Math.min(MAX_HEIGHT, editor.getContentHeight())}px`
    editor.layout()
  }

  editor.onDidContentSizeChange(resizeToContent)
  resizeToContent()

  return editor
}
