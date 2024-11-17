import '@/lib/monaco-vscode-java-default-extension'
import '@/lib/monaco-vscode-theme-defaults-default-extension'
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override'
import getTextMateServiceOverride from '@/lib/monaco-vscode-textmate-service-override'
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override'
import { loadWorkers, regLanguage } from './tools'
import { initialize } from 'vscode/services'
import { JAVA_LANGUAGE_CONFIG, JAVA_LANGUAGE_EXT_POINT, JAVA_LANGUAGE_ID } from '../constants'

export const initEditorService = (cb: () => void) => {
  import('vscode/localExtensionHost').then(async () => {
    loadWorkers()

    await initialize({
      ...getConfigurationServiceOverride(),
      ...getThemeServiceOverride(),
      ...getTextMateServiceOverride()
    })

    //đăng ký java cho monaco editor
    regLanguage({
      langId: JAVA_LANGUAGE_ID,
      langConfig: JAVA_LANGUAGE_CONFIG,
      extPoint: JAVA_LANGUAGE_EXT_POINT
    })
    cb()
  })
}
