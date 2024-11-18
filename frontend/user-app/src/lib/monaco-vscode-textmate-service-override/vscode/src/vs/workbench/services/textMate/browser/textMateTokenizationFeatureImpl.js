import { __decorate, __param } from 'vscode/external/tslib/tslib.es6.js'
import { createStyleSheet } from 'vscode/vscode/vs/base/browser/dom'
import { equals } from 'vscode/vscode/vs/base/common/arrays'
import { Color } from 'vscode/vscode/vs/base/common/color'
import { onUnexpectedError } from 'vscode/vscode/vs/base/common/errors'
import { Disposable, DisposableStore } from 'vscode/vscode/vs/base/common/lifecycle'
import { FileAccess, nodeModulesPath } from 'vscode/vscode/vs/base/common/network'
import 'vscode/vscode/vs/base/common/event'
import 'vscode/vscode/vs/base/common/observableInternal/autorun'
import 'vscode/vscode/vs/base/common/observableInternal/derived'
import 'vscode/vscode/vs/base/common/cancellation'
import { observableFromEvent } from 'vscode/vscode/vs/base/common/observableInternal/utils'
import { isWeb } from 'vscode/vscode/vs/base/common/platform'
import { joinPath, isEqualOrParent } from 'vscode/vscode/vs/base/common/resources'
import { isObject } from 'vscode/vscode/vs/base/common/types'
import { LazyTokenizationSupport, TokenizationRegistry } from 'vscode/vscode/vs/editor/common/languages'
import { ILanguageService } from 'vscode/vscode/vs/editor/common/languages/language'
import { generateTokensCSSForColorMap } from 'vscode/vscode/vs/editor/common/languages/supports/tokenization'
import { localize } from 'vscode/vscode/vs/nls'
import { IConfigurationService } from 'vscode/vscode/vs/platform/configuration/common/configuration.service'
import { IExtensionResourceLoaderService } from 'vscode/vscode/vs/platform/extensionResourceLoader/common/extensionResourceLoader.service'
import { IInstantiationService } from 'vscode/vscode/vs/platform/instantiation/common/instantiation'
import { ILogService } from 'vscode/vscode/vs/platform/log/common/log.service'
import { INotificationService } from 'vscode/vscode/vs/platform/notification/common/notification.service'
import { IProgressService } from 'vscode/vscode/vs/platform/progress/common/progress.service'
import { ITelemetryService } from 'vscode/vscode/vs/platform/telemetry/common/telemetry.service'
import { IWorkbenchEnvironmentService } from 'vscode/vscode/vs/workbench/services/environment/common/environmentService.service'
import { TextMateTokenizationSupport } from './tokenizationSupport/textMateTokenizationSupport.js'
import { TokenizationSupportWithLineLimit } from './tokenizationSupport/tokenizationSupportWithLineLimit.js'
import { ThreadedBackgroundTokenizerFactory } from './backgroundTokenization/threadedBackgroundTokenizerFactory.js'
import { TMGrammarFactory, missingTMGrammarErrorMessage } from '../common/TMGrammarFactory.js'
import { grammarsExtPoint } from 'vscode/vscode/vs/workbench/services/textMate/common/TMGrammars'
import { IWorkbenchThemeService } from 'vscode/vscode/vs/workbench/services/themes/common/workbenchThemeService.service'

function resolveAmdNodeModulePath(nodeModuleName, pathInsideNodeModule) {
  const product = globalThis._VSCODE_PRODUCT_JSON
  Boolean((product ?? globalThis.vscode?.context?.configuration()?.product)?.commit)
  const nodeModulePath = `${nodeModuleName}/${pathInsideNodeModule}`
  const actualNodeModulesPath = nodeModulesPath
  const resourcePath = `${actualNodeModulesPath}/${nodeModulePath}`
  return FileAccess.asBrowserUri(resourcePath).toString(true)
}

var TextMateTokenizationFeature_1
let TextMateTokenizationFeature = class TextMateTokenizationFeature extends Disposable {
  static {
    TextMateTokenizationFeature_1 = this
  }
  static {
    this.reportTokenizationTimeCounter = { sync: 0, async: 0 }
  }
  constructor(
    _languageService,
    _themeService,
    _extensionResourceLoaderService,
    _notificationService,
    _logService,
    _configurationService,
    _progressService,
    _environmentService,
    _instantiationService,
    _telemetryService
  ) {
    super()
    this._languageService = _languageService
    this._themeService = _themeService
    this._extensionResourceLoaderService = _extensionResourceLoaderService
    this._notificationService = _notificationService
    this._logService = _logService
    this._configurationService = _configurationService
    this._progressService = _progressService
    this._environmentService = _environmentService
    this._instantiationService = _instantiationService
    this._telemetryService = _telemetryService
    this._createdModes = []
    this._encounteredLanguages = []
    this._debugMode = false
    this._debugModePrintFunc = () => {}
    this._grammarDefinitions = null
    this._grammarFactory = null
    this._tokenizersRegistrations = new DisposableStore()
    this._currentTheme = null
    this._currentTokenColorMap = null
    this._threadedBackgroundTokenizerFactory = this._instantiationService.createInstance(
      ThreadedBackgroundTokenizerFactory,
      (timeMs, languageId, sourceExtensionId, lineLength, isRandomSample) =>
        this._reportTokenizationTime(timeMs, languageId, sourceExtensionId, lineLength, true, isRandomSample),
      () => this.getAsyncTokenizationEnabled()
    )
    this._vscodeOniguruma = null
    this._styleElement = createStyleSheet()
    this._styleElement.className = 'vscode-tokens-styles'
    grammarsExtPoint.setHandler((extensions) => this._handleGrammarsExtPoint(extensions))
    this._updateTheme(this._themeService.getColorTheme(), true)
    this._register(
      this._themeService.onDidColorThemeChange(() => {
        this._updateTheme(this._themeService.getColorTheme(), false)
      })
    )
    this._register(
      this._languageService.onDidRequestRichLanguageFeatures((languageId) => {
        this._createdModes.push(languageId)
      })
    )
  }
  getAsyncTokenizationEnabled() {
    return !!this._configurationService.getValue('editor.experimental.asyncTokenization')
  }
  getAsyncTokenizationVerification() {
    return !!this._configurationService.getValue('editor.experimental.asyncTokenizationVerification')
  }
  _handleGrammarsExtPoint(extensions) {
    this._grammarDefinitions = null
    if (this._grammarFactory) {
      this._grammarFactory.dispose()
      this._grammarFactory = null
    }
    this._tokenizersRegistrations.clear()
    this._grammarDefinitions = []
    for (const extension of extensions) {
      const grammars = extension.value
      for (const grammar of grammars) {
        const validatedGrammar = this._validateGrammarDefinition(extension, grammar)
        if (validatedGrammar) {
          this._grammarDefinitions.push(validatedGrammar)
          if (validatedGrammar.language) {
            const lazyTokenizationSupport = new LazyTokenizationSupport(() =>
              this._createTokenizationSupport(validatedGrammar.language)
            )
            this._tokenizersRegistrations.add(lazyTokenizationSupport)
            this._tokenizersRegistrations.add(
              TokenizationRegistry.registerFactory(validatedGrammar.language, lazyTokenizationSupport)
            )
          }
        }
      }
    }
    this._threadedBackgroundTokenizerFactory.setGrammarDefinitions(this._grammarDefinitions)
    for (const createdMode of this._createdModes) {
      TokenizationRegistry.getOrCreate(createdMode)
    }
  }
  _validateGrammarDefinition(extension, grammar) {
    if (
      !validateGrammarExtensionPoint(
        extension.description.extensionLocation,
        grammar,
        extension.collector,
        this._languageService
      )
    ) {
      return null
    }
    const grammarLocation = joinPath(extension.description.extensionLocation, grammar.path)
    const embeddedLanguages = Object.create(null)
    if (grammar.embeddedLanguages) {
      const scopes = Object.keys(grammar.embeddedLanguages)
      for (let i = 0, len = scopes.length; i < len; i++) {
        const scope = scopes[i]
        const language = grammar.embeddedLanguages[scope]
        if (typeof language !== 'string') {
          continue
        }
        if (this._languageService.isRegisteredLanguageId(language)) {
          embeddedLanguages[scope] = this._languageService.languageIdCodec.encodeLanguageId(language)
        }
      }
    }
    const tokenTypes = Object.create(null)
    if (grammar.tokenTypes) {
      const scopes = Object.keys(grammar.tokenTypes)
      for (const scope of scopes) {
        const tokenType = grammar.tokenTypes[scope]
        switch (tokenType) {
          case 'string':
            tokenTypes[scope] = 2
            break
          case 'other':
            tokenTypes[scope] = 0
            break
          case 'comment':
            tokenTypes[scope] = 1
            break
        }
      }
    }
    const validLanguageId =
      grammar.language && this._languageService.isRegisteredLanguageId(grammar.language) ? grammar.language : undefined
    function asStringArray(array, defaultValue) {
      if (!Array.isArray(array)) {
        return defaultValue
      }
      if (!array.every((e) => typeof e === 'string')) {
        return defaultValue
      }
      return array
    }
    return {
      location: grammarLocation,
      language: validLanguageId,
      scopeName: grammar.scopeName,
      embeddedLanguages: embeddedLanguages,
      tokenTypes: tokenTypes,
      injectTo: grammar.injectTo,
      balancedBracketSelectors: asStringArray(grammar.balancedBracketScopes, ['*']),
      unbalancedBracketSelectors: asStringArray(grammar.unbalancedBracketScopes, []),
      sourceExtensionId: extension.description.id
    }
  }
  startDebugMode(printFn, onStop) {
    if (this._debugMode) {
      this._notificationService.error(localize(3116, 'Already Logging.'))
      return
    }
    this._debugModePrintFunc = printFn
    this._debugMode = true
    if (this._debugMode) {
      this._progressService.withProgress(
        {
          location: 15,
          buttons: [localize(3117, 'Stop')]
        },
        (progress) => {
          progress.report({
            message: localize(3118, 'Preparing to log TM Grammar parsing. Press Stop when finished.')
          })
          return this._getVSCodeOniguruma().then((vscodeOniguruma) => {
            vscodeOniguruma.setDefaultDebugCall(true)
            progress.report({
              message: localize(3119, 'Now logging TM Grammar parsing. Press Stop when finished.')
            })
            return new Promise(() => {})
          })
        },
        () => {
          this._getVSCodeOniguruma().then((vscodeOniguruma) => {
            this._debugModePrintFunc = () => {}
            this._debugMode = false
            vscodeOniguruma.setDefaultDebugCall(false)
            onStop()
          })
        }
      )
    }
  }
  _canCreateGrammarFactory() {
    return !!this._grammarDefinitions
  }
  async _getOrCreateGrammarFactory() {
    if (this._grammarFactory) {
      return this._grammarFactory
    }
    const [vscodeTextmate, vscodeOniguruma] = await Promise.all([
      import('vscode-textmate').then((module) => module.default ?? module),
      this._getVSCodeOniguruma()
    ])
    const onigLib = Promise.resolve({
      createOnigScanner: (sources) => vscodeOniguruma.createOnigScanner(sources),
      createOnigString: (str) => vscodeOniguruma.createOnigString(str)
    })
    if (this._grammarFactory) {
      return this._grammarFactory
    }
    this._grammarFactory = new TMGrammarFactory(
      {
        logTrace: (msg) => this._logService.trace(msg),
        logError: (msg, err) => this._logService.error(msg, err),
        readFile: (resource) => this._extensionResourceLoaderService.readExtensionResource(resource)
      },
      this._grammarDefinitions || [],
      vscodeTextmate,
      onigLib
    )
    this._updateTheme(this._themeService.getColorTheme(), true)
    return this._grammarFactory
  }
  async _createTokenizationSupport(languageId) {
    if (!this._languageService.isRegisteredLanguageId(languageId)) {
      return null
    }
    if (!this._canCreateGrammarFactory()) {
      return null
    }
    try {
      const grammarFactory = await this._getOrCreateGrammarFactory()
      if (!grammarFactory.has(languageId)) {
        return null
      }
      const encodedLanguageId = this._languageService.languageIdCodec.encodeLanguageId(languageId)
      const r = await grammarFactory.createGrammar(languageId, encodedLanguageId)
      if (!r.grammar) {
        return null
      }
      const maxTokenizationLineLength = observableConfigValue(
        'editor.maxTokenizationLineLength',
        languageId,
        -1,
        this._configurationService
      )
      const tokenization = new TextMateTokenizationSupport(
        r.grammar,
        r.initialState,
        r.containsEmbeddedLanguages,
        (textModel, tokenStore) =>
          this._threadedBackgroundTokenizerFactory.createBackgroundTokenizer(
            textModel,
            tokenStore,
            maxTokenizationLineLength
          ),
        () => this.getAsyncTokenizationVerification(),
        (timeMs, lineLength, isRandomSample) => {
          this._reportTokenizationTime(timeMs, languageId, r.sourceExtensionId, lineLength, false, isRandomSample)
        },
        true
      )
      const disposable = tokenization.onDidEncounterLanguage((encodedLanguageId) => {
        if (!this._encounteredLanguages[encodedLanguageId]) {
          const languageId = this._languageService.languageIdCodec.decodeLanguageId(encodedLanguageId)
          this._encounteredLanguages[encodedLanguageId] = true
          this._languageService.requestBasicLanguageFeatures(languageId)
        }
      })
      return new TokenizationSupportWithLineLimit(
        encodedLanguageId,
        tokenization,
        disposable,
        maxTokenizationLineLength
      )
    } catch (err) {
      if (err.message && err.message === missingTMGrammarErrorMessage) {
        return null
      }
      onUnexpectedError(err)
      return null
    }
  }
  _updateTheme(colorTheme, forceUpdate) {
    if (
      !forceUpdate &&
      this._currentTheme &&
      this._currentTokenColorMap &&
      equalsTokenRules(this._currentTheme.settings, colorTheme.tokenColors) &&
      equals(this._currentTokenColorMap, colorTheme.tokenColorMap)
    ) {
      return
    }
    this._currentTheme = { name: colorTheme.label, settings: colorTheme.tokenColors }
    this._currentTokenColorMap = colorTheme.tokenColorMap
    this._grammarFactory?.setTheme(this._currentTheme, this._currentTokenColorMap)
    const colorMap = toColorMap(this._currentTokenColorMap)
    const cssRules = generateTokensCSSForColorMap(colorMap)
    this._styleElement.textContent = cssRules
    TokenizationRegistry.setColorMap(colorMap)
    if (this._currentTheme && this._currentTokenColorMap) {
      this._threadedBackgroundTokenizerFactory.acceptTheme(this._currentTheme, this._currentTokenColorMap)
    }
  }
  async createTokenizer(languageId) {
    if (!this._languageService.isRegisteredLanguageId(languageId)) {
      return null
    }
    const grammarFactory = await this._getOrCreateGrammarFactory()
    if (!grammarFactory.has(languageId)) {
      return null
    }
    const encodedLanguageId = this._languageService.languageIdCodec.encodeLanguageId(languageId)
    const { grammar } = await grammarFactory.createGrammar(languageId, encodedLanguageId)
    return grammar
  }
  _getVSCodeOniguruma() {
    if (!this._vscodeOniguruma) {
      this._vscodeOniguruma = (async () => {
        const [vscodeOniguruma, wasm] = await Promise.all([
          import('vscode-oniguruma').then((module) => module.default ?? module),
          this._loadVSCodeOnigurumaWASM()
        ])
        await vscodeOniguruma.loadWASM({
          data: wasm,
          print: (str) => {
            this._debugModePrintFunc(str)
          }
        })
        return vscodeOniguruma
      })()
    }
    return this._vscodeOniguruma
  }
  async _loadVSCodeOnigurumaWASM() {
    if (isWeb) {
      const response = await fetch(resolveAmdNodeModulePath('vscode-oniguruma', 'release/onig.wasm'))
      return await response.arrayBuffer()
    } else {
      const response = await fetch(
        FileAccess.asBrowserUri(`${nodeModulesPath}/vscode-oniguruma/release/onig.wasm`).toString(true)
      )
      return response
    }
  }
  _reportTokenizationTime(timeMs, languageId, sourceExtensionId, lineLength, fromWorker, isRandomSample) {
    const key = fromWorker ? 'async' : 'sync'
    if (TextMateTokenizationFeature_1.reportTokenizationTimeCounter[key] > 50) {
      return
    }
    if (TextMateTokenizationFeature_1.reportTokenizationTimeCounter[key] === 0) {
      setTimeout(
        () => {
          TextMateTokenizationFeature_1.reportTokenizationTimeCounter[key] = 0
        },
        1000 * 60 * 60
      )
    }
    TextMateTokenizationFeature_1.reportTokenizationTimeCounter[key]++
    this._telemetryService.publicLog2('editor.tokenizedLine', {
      timeMs,
      languageId,
      lineLength,
      fromWorker,
      sourceExtensionId,
      isRandomSample,
      tokenizationSetting: this.getAsyncTokenizationEnabled() ? (this.getAsyncTokenizationVerification() ? 2 : 1) : 0
    })
  }
}
TextMateTokenizationFeature = TextMateTokenizationFeature_1 = __decorate(
  [
    __param(0, ILanguageService),
    __param(1, IWorkbenchThemeService),
    __param(2, IExtensionResourceLoaderService),
    __param(3, INotificationService),
    __param(4, ILogService),
    __param(5, IConfigurationService),
    __param(6, IProgressService),
    __param(7, IWorkbenchEnvironmentService),
    __param(8, IInstantiationService),
    __param(9, ITelemetryService)
  ],
  TextMateTokenizationFeature
)
function toColorMap(colorMap) {
  const result = [null]
  for (let i = 1, len = colorMap.length; i < len; i++) {
    result[i] = Color.fromHex(colorMap[i])
  }
  return result
}
function equalsTokenRules(a, b) {
  if (!b || !a || b.length !== a.length) {
    return false
  }
  for (let i = b.length - 1; i >= 0; i--) {
    const r1 = b[i]
    const r2 = a[i]
    if (r1.scope !== r2.scope) {
      return false
    }
    const s1 = r1.settings
    const s2 = r2.settings
    if (s1 && s2) {
      if (s1.fontStyle !== s2.fontStyle || s1.foreground !== s2.foreground || s1.background !== s2.background) {
        return false
      }
    } else if (!s1 || !s2) {
      return false
    }
  }
  return true
}
function validateGrammarExtensionPoint(extensionLocation, syntax, collector, _languageService) {
  if (
    syntax.language &&
    (typeof syntax.language !== 'string' || !_languageService.isRegisteredLanguageId(syntax.language))
  ) {
    collector.error(
      localize(
        3120,
        'Unknown language in `contributes.{0}.language`. Provided value: {1}',
        grammarsExtPoint.name,
        String(syntax.language)
      )
    )
    return false
  }
  if (!syntax.scopeName || typeof syntax.scopeName !== 'string') {
    collector.error(
      localize(
        3121,
        'Expected string in `contributes.{0}.scopeName`. Provided value: {1}',
        grammarsExtPoint.name,
        String(syntax.scopeName)
      )
    )
    return false
  }
  if (!syntax.path || typeof syntax.path !== 'string') {
    collector.error(
      localize(
        3122,
        'Expected string in `contributes.{0}.path`. Provided value: {1}',
        grammarsExtPoint.name,
        String(syntax.path)
      )
    )
    return false
  }
  if (
    syntax.injectTo &&
    (!Array.isArray(syntax.injectTo) || syntax.injectTo.some((scope) => typeof scope !== 'string'))
  ) {
    collector.error(
      localize(
        3123,
        'Invalid value in `contributes.{0}.injectTo`. Must be an array of language scope names. Provided value: {1}',
        grammarsExtPoint.name,
        JSON.stringify(syntax.injectTo)
      )
    )
    return false
  }
  if (syntax.embeddedLanguages && !isObject(syntax.embeddedLanguages)) {
    collector.error(
      localize(
        3124,
        'Invalid value in `contributes.{0}.embeddedLanguages`. Must be an object map from scope name to language. Provided value: {1}',
        grammarsExtPoint.name,
        JSON.stringify(syntax.embeddedLanguages)
      )
    )
    return false
  }
  if (syntax.tokenTypes && !isObject(syntax.tokenTypes)) {
    collector.error(
      localize(
        3125,
        'Invalid value in `contributes.{0}.tokenTypes`. Must be an object map from scope name to token type. Provided value: {1}',
        grammarsExtPoint.name,
        JSON.stringify(syntax.tokenTypes)
      )
    )
    return false
  }
  const grammarLocation = joinPath(extensionLocation, syntax.path)
  if (!isEqualOrParent(grammarLocation, extensionLocation)) {
    collector.warn(
      localize(
        3126,
        "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.",
        grammarsExtPoint.name,
        grammarLocation.path,
        extensionLocation.path
      )
    )
  }
  return true
}
function observableConfigValue(key, languageId, defaultValue, configurationService) {
  return observableFromEvent(
    (handleChange) =>
      configurationService.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration(key, { overrideIdentifier: languageId })) {
          handleChange(e)
        }
      }),
    () => configurationService.getValue(key, { overrideIdentifier: languageId }) ?? defaultValue
  )
}

export { TextMateTokenizationFeature }
