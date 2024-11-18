import { JAVA_LANGUAGE_EXT_POINT } from './../constants/index'
export type WorkerLoader = () => Worker
import * as monaco from 'monaco-editor'

export interface LanguageConfig {
  langId: string
  langConfig?: monaco.languages.LanguageConfiguration
  extPoint: monaco.languages.ILanguageExtensionPoint
}

export const loadWorkers = () => {
  const workerLoaders: Partial<Record<string, WorkerLoader>> = {
    TextEditorWorker: () =>
      new Worker(
        new URL(
          'monaco-editor/esm/vs/editor/editor.worker.js',
          //@ts-ignore
          import.meta.url
        ),
        { type: 'module' }
      ),
    TextMateWorker: () =>
      new Worker(
        new URL(
          '@codingame/monaco-vscode-textmate-service-override/worker',
          //@ts-ignore
          import.meta.url
        ),
        { type: 'module' }
      )
  }

  window.MonacoEnvironment = {
    getWorker: function (_moduleId, label) {
      const workerFactory = workerLoaders[label]
      if (workerFactory != null) {
        return workerFactory()
      }
      throw new Error(`Unimplemented worker ${label} (${_moduleId})`)
    }
  }
}

export const regLanguage = (langConfig: LanguageConfig) => {
  // Đăng ký ngôn ngữ cho Monaco
  if (!monaco.languages.getEncodedLanguageId(langConfig.langId)) {
    monaco.languages.register(langConfig.extPoint)

    // Cấu hình chức năng ngôn ngữ
    monaco.languages.setLanguageConfiguration(langConfig.langId, langConfig.langConfig || {})
  }
}
