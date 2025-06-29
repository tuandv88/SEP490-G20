import { RunOnceScheduler } from 'vscode/vscode/vs/base/common/async'
import { observableValue } from 'vscode/vscode/vs/base/common/observableInternal/base'
import 'vscode/vscode/vs/base/common/arrays'
import 'vscode/vscode/vs/base/common/event'
import { Disposable } from 'vscode/vscode/vs/base/common/lifecycle'
import 'vscode/vscode/vs/base/common/observableInternal/autorun'
import 'vscode/vscode/vs/base/common/observableInternal/derived'
import 'vscode/vscode/vs/base/common/cancellation'
import 'vscode/vscode/vs/base/common/observableInternal/utils'
import { setTimeout0 } from 'vscode/vscode/vs/base/common/platform'
import { LineRange } from 'vscode/vscode/vs/editor/common/core/lineRange'
import { MirrorTextModel } from 'vscode/vscode/vs/editor/common/model/mirrorTextModel'
import { TokenizerWithStateStore } from 'vscode/vscode/vs/editor/common/model/textModelTokens'
import { ContiguousMultilineTokensBuilder } from 'vscode/vscode/vs/editor/common/tokens/contiguousMultilineTokensBuilder'
import { LineTokens } from 'vscode/vscode/vs/editor/common/tokens/lineTokens'
import { TextMateTokenizationSupport } from '../../tokenizationSupport/textMateTokenizationSupport.js'
import { TokenizationSupportWithLineLimit } from '../../tokenizationSupport/tokenizationSupportWithLineLimit.js'

class TextMateWorkerTokenizer extends MirrorTextModel {
  constructor(uri, lines, eol, versionId, _host, _languageId, _encodedLanguageId, maxTokenizationLineLength) {
    super(uri, lines, eol, versionId)
    this._host = _host
    this._languageId = _languageId
    this._encodedLanguageId = _encodedLanguageId
    this._tokenizerWithStateStore = null
    this._isDisposed = false
    this._maxTokenizationLineLength = observableValue(this, -1)
    this._tokenizeDebouncer = new RunOnceScheduler(() => this._tokenize(), 10)
    this._maxTokenizationLineLength.set(maxTokenizationLineLength, undefined)
    this._resetTokenization()
  }
  dispose() {
    this._isDisposed = true
    super.dispose()
  }
  onLanguageId(languageId, encodedLanguageId) {
    this._languageId = languageId
    this._encodedLanguageId = encodedLanguageId
    this._resetTokenization()
  }
  onEvents(e) {
    super.onEvents(e)
    this._tokenizerWithStateStore?.store.acceptChanges(e.changes)
    this._tokenizeDebouncer.schedule()
  }
  acceptMaxTokenizationLineLength(maxTokenizationLineLength) {
    this._maxTokenizationLineLength.set(maxTokenizationLineLength, undefined)
  }
  retokenize(startLineNumber, endLineNumberExclusive) {
    if (this._tokenizerWithStateStore) {
      this._tokenizerWithStateStore.store.invalidateEndStateRange(
        new LineRange(startLineNumber, endLineNumberExclusive)
      )
      this._tokenizeDebouncer.schedule()
    }
  }
  async _resetTokenization() {
    this._tokenizerWithStateStore = null
    const languageId = this._languageId
    const encodedLanguageId = this._encodedLanguageId
    const r = await this._host.getOrCreateGrammar(languageId, encodedLanguageId)
    if (this._isDisposed || languageId !== this._languageId || encodedLanguageId !== this._encodedLanguageId || !r) {
      return
    }
    if (r.grammar) {
      const tokenizationSupport = new TokenizationSupportWithLineLimit(
        this._encodedLanguageId,
        new TextMateTokenizationSupport(
          r.grammar,
          r.initialState,
          false,
          undefined,
          () => false,
          (timeMs, lineLength, isRandomSample) => {
            this._host.reportTokenizationTime(timeMs, languageId, r.sourceExtensionId, lineLength, isRandomSample)
          },
          false
        ),
        Disposable.None,
        this._maxTokenizationLineLength
      )
      this._tokenizerWithStateStore = new TokenizerWithStateStore(this._lines.length, tokenizationSupport)
    } else {
      this._tokenizerWithStateStore = null
    }
    this._tokenize()
  }
  async _tokenize() {
    if (this._isDisposed || !this._tokenizerWithStateStore) {
      return
    }
    if (!this._diffStateStacksRefEqFn) {
      const { diffStateStacksRefEq } = await import('vscode-textmate').then((module) => module.default ?? module)
      this._diffStateStacksRefEqFn = diffStateStacksRefEq
    }
    const startTime = new Date().getTime()
    while (true) {
      let tokenizedLines = 0
      const tokenBuilder = new ContiguousMultilineTokensBuilder()
      const stateDeltaBuilder = new StateDeltaBuilder()
      while (true) {
        const lineToTokenize = this._tokenizerWithStateStore.getFirstInvalidLine()
        if (lineToTokenize === null || tokenizedLines > 200) {
          break
        }
        tokenizedLines++
        const text = this._lines[lineToTokenize.lineNumber - 1]
        const r = this._tokenizerWithStateStore.tokenizationSupport.tokenizeEncoded(
          text,
          true,
          lineToTokenize.startState
        )
        if (this._tokenizerWithStateStore.store.setEndState(lineToTokenize.lineNumber, r.endState)) {
          const delta = this._diffStateStacksRefEqFn(lineToTokenize.startState, r.endState)
          stateDeltaBuilder.setState(lineToTokenize.lineNumber, delta)
        } else {
          stateDeltaBuilder.setState(lineToTokenize.lineNumber, null)
        }
        LineTokens.convertToEndOffset(r.tokens, text.length)
        tokenBuilder.add(lineToTokenize.lineNumber, r.tokens)
        const deltaMs = new Date().getTime() - startTime
        if (deltaMs > 20) {
          break
        }
      }
      if (tokenizedLines === 0) {
        break
      }
      const stateDeltas = stateDeltaBuilder.getStateDeltas()
      this._host.setTokensAndStates(this._versionId, tokenBuilder.serialize(), stateDeltas)
      const deltaMs = new Date().getTime() - startTime
      if (deltaMs > 20) {
        setTimeout0(() => this._tokenize())
        return
      }
    }
  }
}
class StateDeltaBuilder {
  constructor() {
    this._lastStartLineNumber = -1
    this._stateDeltas = []
  }
  setState(lineNumber, stackDiff) {
    if (lineNumber === this._lastStartLineNumber + 1) {
      this._stateDeltas[this._stateDeltas.length - 1].stateDeltas.push(stackDiff)
    } else {
      this._stateDeltas.push({ startLineNumber: lineNumber, stateDeltas: [stackDiff] })
    }
    this._lastStartLineNumber = lineNumber
  }
  getStateDeltas() {
    return this._stateDeltas
  }
}

export { TextMateWorkerTokenizer }
