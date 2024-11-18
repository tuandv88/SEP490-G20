import { __decorate, __param } from 'vscode/external/tslib/tslib.es6.js';
import { DisposableStore, toDisposable } from 'vscode/vscode/vs/base/common/lifecycle';
import { nodeModulesPath, FileAccess } from 'vscode/vscode/vs/base/common/network';
import 'vscode/vscode/vs/base/common/platform';
import { URI } from 'vscode/vscode/vs/base/common/uri';
import { ILanguageService } from 'vscode/vscode/vs/editor/common/languages/language';
import { IConfigurationService } from 'vscode/vscode/vs/platform/configuration/common/configuration.service';
import { IEnvironmentService } from 'vscode/vscode/vs/platform/environment/common/environment.service';
import { IExtensionResourceLoaderService } from 'vscode/vscode/vs/platform/extensionResourceLoader/common/extensionResourceLoader.service';
import { INotificationService } from 'vscode/vscode/vs/platform/notification/common/notification.service';
import { ITelemetryService } from 'vscode/vscode/vs/platform/telemetry/common/telemetry.service';
import { TextMateWorkerHost } from './worker/textMateWorkerHost.js';
import { TextMateWorkerTokenizerController } from './textMateWorkerTokenizerController.js';
import { createWebWorker } from 'vscode/vscode/vs/base/browser/defaultWorkerFactory';

var ThreadedBackgroundTokenizerFactory_1;
let ThreadedBackgroundTokenizerFactory = class ThreadedBackgroundTokenizerFactory {
    static { ThreadedBackgroundTokenizerFactory_1 = this; }
    static { this._reportedMismatchingTokens = false; }
    constructor(_reportTokenizationTime, _shouldTokenizeAsync, _extensionResourceLoaderService, _configurationService, _languageService, _environmentService, _notificationService, _telemetryService) {
        this._reportTokenizationTime = _reportTokenizationTime;
        this._shouldTokenizeAsync = _shouldTokenizeAsync;
        this._extensionResourceLoaderService = _extensionResourceLoaderService;
        this._configurationService = _configurationService;
        this._languageService = _languageService;
        this._environmentService = _environmentService;
        this._notificationService = _notificationService;
        this._telemetryService = _telemetryService;
        this._workerProxyPromise = null;
        this._worker = null;
        this._workerProxy = null;
        this._workerTokenizerControllers = ( new Map());
        this._currentTheme = null;
        this._currentTokenColorMap = null;
        this._grammarDefinitions = [];
    }
    dispose() {
        this._disposeWorker();
    }
    createBackgroundTokenizer(textModel, tokenStore, maxTokenizationLineLength) {
        if (!this._shouldTokenizeAsync() || textModel.isTooLargeForSyncing()) {
            return undefined;
        }
        const store = ( new DisposableStore());
        const controllerContainer = this._getWorkerProxy().then((workerProxy) => {
            if (store.isDisposed || !workerProxy) {
                return undefined;
            }
            const controllerContainer = { controller: undefined, worker: this._worker };
            store.add(keepAliveWhenAttached(textModel, () => {
                const controller = ( new TextMateWorkerTokenizerController(
                    textModel,
                    workerProxy,
                    this._languageService.languageIdCodec,
                    tokenStore,
                    this._configurationService,
                    maxTokenizationLineLength
                ));
                controllerContainer.controller = controller;
                this._workerTokenizerControllers.set(controller.controllerId, controller);
                return toDisposable(() => {
                    controllerContainer.controller = undefined;
                    this._workerTokenizerControllers.delete(controller.controllerId);
                    controller.dispose();
                });
            }));
            return controllerContainer;
        });
        return {
            dispose() {
                store.dispose();
            },
            requestTokens: async (startLineNumber, endLineNumberExclusive) => {
                const container = await controllerContainer;
                if (container?.controller && container.worker === this._worker) {
                    container.controller.requestTokens(startLineNumber, endLineNumberExclusive);
                }
            },
            reportMismatchingTokens: (lineNumber) => {
                if (ThreadedBackgroundTokenizerFactory_1._reportedMismatchingTokens) {
                    return;
                }
                ThreadedBackgroundTokenizerFactory_1._reportedMismatchingTokens = true;
                this._notificationService.error({
                    message: 'Async Tokenization Token Mismatch in line ' + lineNumber,
                    name: 'Async Tokenization Token Mismatch',
                });
                this._telemetryService.publicLog2('asyncTokenizationMismatchingTokens', {});
            },
        };
    }
    setGrammarDefinitions(grammarDefinitions) {
        this._grammarDefinitions = grammarDefinitions;
        this._disposeWorker();
    }
    acceptTheme(theme, colorMap) {
        this._currentTheme = theme;
        this._currentTokenColorMap = colorMap;
        if (this._currentTheme && this._currentTokenColorMap && this._workerProxy) {
            this._workerProxy.$acceptTheme(this._currentTheme, this._currentTokenColorMap);
        }
    }
    _getWorkerProxy() {
        if (!this._workerProxyPromise) {
            this._workerProxyPromise = this._createWorkerProxy();
        }
        return this._workerProxyPromise;
    }
    async _createWorkerProxy() {
        const onigurumaModuleLocation = `${nodeModulesPath}/vscode-oniguruma`;
        const onigurumaLocation = onigurumaModuleLocation;
        const onigurumaWASM = `${onigurumaLocation}/release/onig.wasm`;
        const createData = {
            grammarDefinitions: this._grammarDefinitions,
            onigurumaWASMUri: ( ( FileAccess.asBrowserUri(onigurumaWASM)).toString(true)),
        };
        const worker = this._worker = createWebWorker('vs/workbench/services/textMate/browser/backgroundTokenization/worker/textMateTokenizationWorker.worker', 'TextMateWorker');
        TextMateWorkerHost.setChannel(worker, {
            $readFile: async (_resource) => {
                const resource = URI.revive(_resource);
                return this._extensionResourceLoaderService.readExtensionResource(resource);
            },
            $setTokensAndStates: async (controllerId, versionId, tokens, lineEndStateDeltas) => {
                const controller = this._workerTokenizerControllers.get(controllerId);
                if (controller) {
                    controller.setTokensAndStates(controllerId, versionId, tokens, lineEndStateDeltas);
                }
            },
            $reportTokenizationTime: (timeMs, languageId, sourceExtensionId, lineLength, isRandomSample) => {
                this._reportTokenizationTime(timeMs, languageId, sourceExtensionId, lineLength, isRandomSample);
            }
        });
        await worker.proxy.$init(createData);
        if (this._worker !== worker) {
            return null;
        }
        this._workerProxy = worker.proxy;
        if (this._currentTheme && this._currentTokenColorMap) {
            this._workerProxy.$acceptTheme(this._currentTheme, this._currentTokenColorMap);
        }
        return worker.proxy;
    }
    _disposeWorker() {
        for (const controller of ( this._workerTokenizerControllers.values())) {
            controller.dispose();
        }
        this._workerTokenizerControllers.clear();
        if (this._worker) {
            this._worker.dispose();
            this._worker = null;
        }
        this._workerProxy = null;
        this._workerProxyPromise = null;
    }
};
ThreadedBackgroundTokenizerFactory = ThreadedBackgroundTokenizerFactory_1 = ( __decorate([
    ( __param(2, IExtensionResourceLoaderService)),
    ( __param(3, IConfigurationService)),
    ( __param(4, ILanguageService)),
    ( __param(5, IEnvironmentService)),
    ( __param(6, INotificationService)),
    ( __param(7, ITelemetryService))
], ThreadedBackgroundTokenizerFactory));
function keepAliveWhenAttached(textModel, factory) {
    const disposableStore = ( new DisposableStore());
    const subStore = disposableStore.add(( new DisposableStore()));
    function checkAttached() {
        if (textModel.isAttachedToEditor()) {
            subStore.add(factory());
        }
        else {
            subStore.clear();
        }
    }
    checkAttached();
    disposableStore.add(textModel.onDidChangeAttached(() => {
        checkAttached();
    }));
    return disposableStore;
}

export { ThreadedBackgroundTokenizerFactory };
