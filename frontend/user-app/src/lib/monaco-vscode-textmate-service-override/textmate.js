import { StandaloneServices } from 'vscode/vscode/vs/editor/standalone/browser/standaloneServices'
import { ITextMateTokenizationService } from 'vscode/vscode/vs/workbench/services/textMate/browser/textMateTokenizationFeature.service'
export { ITextMateTokenizationService } from 'vscode/vscode/vs/workbench/services/textMate/browser/textMateTokenizationFeature.service'
import { SyncDescriptor } from 'vscode/vscode/vs/platform/instantiation/common/descriptors'
import { TextMateTokenizationFeature } from './vscode/src/vs/workbench/services/textMate/browser/textMateTokenizationFeatureImpl.js'
import { ILifecycleService } from 'vscode/vscode/vs/workbench/services/lifecycle/common/lifecycle.service'
import getServiceOverride$1 from '@codingame/monaco-vscode-files-service-override'
import { registerServiceInitializeParticipant } from 'vscode/lifecycle'
import { registerAssets } from 'vscode/assets'
import './vscode/src/vs/workbench/services/themes/common/tokenClassificationExtensionPoint.js'
import 'vscode/vscode/vs/workbench/contrib/codeEditor/browser/inspectEditorTokens/inspectEditorTokens'

const _onigWasm = new URL('vscode-oniguruma/release/onig.wasm', import.meta.url).href
registerAssets({
  'vscode-oniguruma/../onig.wasm': _onigWasm,
  'vs/../../node_modules/vscode-oniguruma/release/onig.wasm': _onigWasm
})
registerServiceInitializeParticipant(async (accessor) => {
  void accessor
    .get(ILifecycleService)
    .when(2)
    .then(() => {
      StandaloneServices.get(ITextMateTokenizationService)
    })
})
function getServiceOverride() {
  return {
    ...getServiceOverride$1(),
    [ITextMateTokenizationService.toString()]: new SyncDescriptor(TextMateTokenizationFeature, [], false)
  }
}

export { getServiceOverride as default }
