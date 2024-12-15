// monaco-java-editor.ts
import * as monaco from "monaco-editor";
import { MonacoLanguageClient } from "monaco-languageclient";
import * as vscode from "vscode";
import { MessageTransports } from "vscode-languageclient";
import { CloseAction, ErrorAction } from "vscode-languageclient/browser.js";
import {
  toSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from "vscode-ws-jsonrpc";
import { createConnection } from "vscode-ws-jsonrpc/server";
import "vscode/localExtensionHost";
import { LanguageConfig, regLanguage } from "./tools";

export interface URIConverter {
  (value: vscode.Uri): string;
}

export interface ConnectConfig {
  url: string;
  fileUri: string;
  workspaceUri: string;
}

export type JavaMonacoEditorParams = Pick<
  JavaMonacoEditor,
  "langConfig" | "connectConfig" | "containerId"
>;

export class JavaMonacoEditor {
  editor!: monaco.editor.IStandaloneCodeEditor;
  languageClient!: MonacoLanguageClient;

  /**
   * @param url socket url
   *
   * @type {ConnectConfig}
   * @memberof JavaMonacoEditor
   */
  connectConfig: ConnectConfig;
  langConfig: LanguageConfig;
  containerId: string;
  model!: monaco.editor.ITextModel;
  //moi them
  didUnmount: boolean = false;

  constructor({
    connectConfig,
    containerId,
    langConfig,
  }: JavaMonacoEditorParams) {
    this.didUnmount = false;
    this.containerId = containerId;
    this.connectConfig = connectConfig;
    this.langConfig = langConfig;
  }

  async createEditor(
    value: string,
    override: monaco.editor.IEditorOverrideServices = {}
  ) {
    this.model = monaco.editor.getModel(this.getFileUri());

    if (this.model) {
      this.model.dispose();
    }
    this.model = await monaco.editor.createModel(
      value,
      this.langConfig.langId,
      this.getFileUri()
    );

    this.editor = monaco.editor.getEditors().find(
      //@ts-ignore
      (editor) => editor._domElement?.id == this.containerId
    ) as monaco.editor.IStandaloneCodeEditor;

    if (this.editor) {
      this.editor.dispose();
    }
    this.editor = monaco.editor.create(
      document.getElementById(this.containerId)!,
      {
        automaticLayout: true,
        model: this.model,
      },
      override
    );

    this.setJavaCode(value);
  }

  async initializeJavaLanguageServer() {
    if(this.connectConfig.url === null) {
      return
    }
    const retryInterval = 5000;
    const keepAliveInterval = 30000; 
    let keepAliveTimer: NodeJS.Timeout;

    const connect = () => {
        return new Promise<void>((resolve, reject) => {
            //moi them
            if(this.connectConfig.url === null) {
                reject()
            }
            const webSocket = new WebSocket(this.connectConfig.url);

            webSocket.onopen = async () => {
                const socket = toSocket(webSocket);
                const messageReader = new WebSocketMessageReader(socket);
                const messageWriter = new WebSocketMessageWriter(socket);
                const connection = createConnection(
                    messageReader,
                    messageWriter,
                    () => socket.dispose()
                );

                keepAliveTimer = setInterval(() => {
                    if (webSocket.readyState === WebSocket.OPEN) {
                        webSocket.send('ping');
                    }
                }, keepAliveInterval);

                connection.onClose(() => {
                    clearInterval(keepAliveTimer);
                    connection.dispose();
                    setTimeout(connect, retryInterval); 
                });

                await this.createLanguageClient(connection);
                resolve();
            };

            webSocket.onerror = () => {
                clearInterval(keepAliveTimer);
                //console.error(`WebSocket connection failed: ${this.connectConfig.url}`);
                setTimeout(connect, retryInterval); 
                reject();
            };
        });
    };

    await connect();
}

  getFileUri() {
    return vscode.Uri.parse(this.connectConfig.fileUri);
  }

  private async createLanguageClient(connection: MessageTransports) {
    this.languageClient = new MonacoLanguageClient({
      name: "Language Client",
      clientOptions: {
        documentSelector: [this.langConfig.langId],

        workspaceFolder: {
          index: 0,
          name: "workspace",
          uri: vscode.Uri.parse(this.connectConfig.workspaceUri),
        },
        // disable the default error handler
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart }),
        },
        middleware: {
          handleDiagnostics(uri, diagnostics, next) {},
        }
      },
      // create a language client connection from the JSON RPC connection on demand
      connectionProvider: {
        get: async (_encoding: string) => connection,
      },
    });

    // Khởi động language client
    await this.languageClient.start();

    //moi them
    if(this.didUnmount) {
      this.dispose();
    }
  }

  // API để tương tác với editor
  public setJavaCode(code: string): void {
    this.editor.setValue(code);
  }

  public getJavaCode(): string {
    return this.editor.getValue();
  }

  // Cleanup
  dispose() {
    this.didUnmount = true
    if (this.languageClient) {
      this.languageClient.stop().then(() => {
        this.languageClient.dispose()
      }).catch(() => {
        // Bỏ qua lỗi nếu có
      })
    }
    if (this.model) {
      this.model.dispose()
    }
    if (this.editor) {
      this.editor.dispose()
    }
  }
}
