import Editor from '@/lib/code-editor/components/Editor'
import { JAVA_LANGUAGE_CONFIG, JAVA_LANGUAGE_EXT_POINT, JAVA_LANGUAGE_ID } from '@/lib/code-editor/constants'

const Code = () => {

  const sample = "Hhahaa";

  return (
    <div className='w-screen h-screen flex flex-col'>
      <Editor
        langConfig={{
          extPoint: JAVA_LANGUAGE_EXT_POINT,
          langId: JAVA_LANGUAGE_ID,
          langConfig: JAVA_LANGUAGE_CONFIG
        }}
        vsCodeSettingsJson={JSON.stringify({
          'editor.fontSize': 14,
          'editor.lineHeight': 20,
          'editor.fontFamily': 'monospace',
          'editor.fontWeight': 'normal',
          'editor.indentSize': 'tabSize',
          'workbench.colorTheme': 'Default Dark Modern',
          'editor.guides.bracketPairsHorizontal': 'active',
          'editor.experimental.asyncTokenization': true
        })}
        connectConfig={{
          fileUri: 'home/mlc/packages/examples/resources/eclipse.jdt.ls/workspace/ICoderVN/src/Solution.java',
          url: 'wss://lsp.icoder.vn/jdtls',
          workspaceUri: 'home/mlc/packages/examples/resources/eclipse.jdt.ls/workspace/ICoderVN'
        }}
        //initValue={sample.toString()}
        sampleFile='resources/com/example/app/Solution.java'
        containerId={'editor'}
      />
    </div>
  )
}

export default Code
