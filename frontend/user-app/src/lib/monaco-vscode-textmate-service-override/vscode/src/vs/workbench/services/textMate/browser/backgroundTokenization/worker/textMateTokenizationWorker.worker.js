import { URI } from 'vscode/vscode/vs/base/common/uri'
import { TMGrammarFactory } from '../../../common/TMGrammarFactory.js'
import { TextMateWorkerTokenizer } from './textMateWorkerTokenizer.js'
import { TextMateWorkerHost } from './textMateWorkerHost.js'

function create(workerServer) {
  return new TextMateTokenizationWorker(workerServer)
}
class TextMateTokenizationWorker {
  constructor(workerServer) {
    this._models = new Map()
    this._grammarCache = []
    this._grammarFactory = Promise.resolve(null)
    this._host = TextMateWorkerHost.getChannel(workerServer)
  }
  async $init(_createData) {
    const grammarDefinitions = _createData.grammarDefinitions.map((def) => {
      return {
        location: URI.revive(def.location),
        language: def.language,
        scopeName: def.scopeName,
        embeddedLanguages: def.embeddedLanguages,
        tokenTypes: def.tokenTypes,
        injectTo: def.injectTo,
        balancedBracketSelectors: def.balancedBracketSelectors,
        unbalancedBracketSelectors: def.unbalancedBracketSelectors,
        sourceExtensionId: def.sourceExtensionId
      }
    })
    this._grammarFactory = this._loadTMGrammarFactory(grammarDefinitions, _createData.onigurumaWASMUri)
  }
  async _loadTMGrammarFactory(grammarDefinitions, onigurumaWASMUri) {
    const vscodeTextmate = await import('vscode-textmate').then((module) => module.default ?? module)
    const vscodeOniguruma = await import('vscode-oniguruma').then((module) => module.default ?? module)
    const response = await fetch(onigurumaWASMUri)
    const bytes = await response.arrayBuffer()
    await vscodeOniguruma.loadWASM(bytes)
    const onigLib = Promise.resolve({
      createOnigScanner: (sources) => vscodeOniguruma.createOnigScanner(sources),
      createOnigString: (str) => vscodeOniguruma.createOnigString(str)
    })
    return new TMGrammarFactory(
      {
        logTrace: () => {},
        logError: (msg, err) => console.error(msg, err),
        readFile: (resource) => this._host.$readFile(resource)
      },
      grammarDefinitions,
      vscodeTextmate,
      onigLib
    )
  }
  $acceptNewModel(data) {
    const uri = URI.revive(data.uri)
    const that = this
    this._models.set(
      data.controllerId,
      new TextMateWorkerTokenizer(
        uri,
        data.lines,
        data.EOL,
        data.versionId,
        {
          async getOrCreateGrammar(languageId, encodedLanguageId) {
            const grammarFactory = await that._grammarFactory
            if (!grammarFactory) {
              return Promise.resolve(null)
            }
            if (!that._grammarCache[encodedLanguageId]) {
              that._grammarCache[encodedLanguageId] = grammarFactory.createGrammar(languageId, encodedLanguageId)
            }
            return that._grammarCache[encodedLanguageId]
          },
          setTokensAndStates(versionId, tokens, stateDeltas) {
            that._host.$setTokensAndStates(data.controllerId, versionId, tokens, stateDeltas)
          },
          reportTokenizationTime(timeMs, languageId, sourceExtensionId, lineLength, isRandomSample) {
            that._host.$reportTokenizationTime(timeMs, languageId, sourceExtensionId, lineLength, isRandomSample)
          }
        },
        data.languageId,
        data.encodedLanguageId,
        data.maxTokenizationLineLength
      )
    )
  }
  $acceptModelChanged(controllerId, e) {
    this._models.get(controllerId).onEvents(e)
  }
  $retokenize(controllerId, startLineNumber, endLineNumberExclusive) {
    this._models.get(controllerId).retokenize(startLineNumber, endLineNumberExclusive)
  }
  $acceptModelLanguageChanged(controllerId, newLanguageId, newEncodedLanguageId) {
    this._models.get(controllerId).onLanguageId(newLanguageId, newEncodedLanguageId)
  }
  $acceptRemovedModel(controllerId) {
    const model = this._models.get(controllerId)
    if (model) {
      model.dispose()
      this._models.delete(controllerId)
    }
  }
  async $acceptTheme(theme, colorMap) {
    const grammarFactory = await this._grammarFactory
    grammarFactory?.setTheme(theme, colorMap)
  }
  $acceptMaxTokenizationLineLength(controllerId, value) {
    this._models.get(controllerId).acceptMaxTokenizationLineLength(value)
  }
}

export { TextMateTokenizationWorker, create }
