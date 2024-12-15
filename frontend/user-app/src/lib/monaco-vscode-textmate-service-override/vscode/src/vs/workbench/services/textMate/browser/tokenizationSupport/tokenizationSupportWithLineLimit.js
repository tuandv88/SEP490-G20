import { nullTokenizeEncoded } from 'vscode/vscode/vs/editor/common/languages/nullTokenize';
import { Disposable } from 'vscode/vscode/vs/base/common/lifecycle';
import 'vscode/vscode/vs/base/common/arrays';
import 'vscode/vscode/vs/base/common/event';
import 'vscode/vscode/vs/base/common/observableInternal/autorun';
import 'vscode/vscode/vs/base/common/observableInternal/derived';
import 'vscode/vscode/vs/base/common/cancellation';
import { keepObserved } from 'vscode/vscode/vs/base/common/observableInternal/utils';

class TokenizationSupportWithLineLimit extends Disposable {
    get backgroundTokenizerShouldOnlyVerifyTokens() {
        return this._actual.backgroundTokenizerShouldOnlyVerifyTokens;
    }
    constructor(_encodedLanguageId, _actual, disposable, _maxTokenizationLineLength) {
        super();
        this._encodedLanguageId = _encodedLanguageId;
        this._actual = _actual;
        this._maxTokenizationLineLength = _maxTokenizationLineLength;
        this._register(keepObserved(this._maxTokenizationLineLength));
        this._register(disposable);
    }
    getInitialState() {
        return this._actual.getInitialState();
    }
    tokenize(line, hasEOL, state) {
        throw ( new Error('Not supported!'));
    }
    tokenizeEncoded(line, hasEOL, state) {
        // if (line.length >= this._maxTokenizationLineLength.get()) {
        //     return nullTokenizeEncoded(this._encodedLanguageId, state);
        // }
        // return this._actual.tokenizeEncoded(line, hasEOL, state);
        try {
            if (!line || line.length >= this._maxTokenizationLineLength.get()) {
                return nullTokenizeEncoded(this._encodedLanguageId, state);
            }
            return this._actual.tokenizeEncoded(line, hasEOL, state);
        } catch {
            return nullTokenizeEncoded(this._encodedLanguageId, state); 
        }
    }
    createBackgroundTokenizer(textModel, store) {
        if (this._actual.createBackgroundTokenizer) {
            return this._actual.createBackgroundTokenizer(textModel, store);
        }
        else {
            return undefined;
        }
    }
}

export { TokenizationSupportWithLineLimit };
