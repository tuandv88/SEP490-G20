import { updateUserConfiguration } from '@codingame/monaco-vscode-configuration-service-override'
import { useEffect, useState } from 'react'
import { JavaMonacoEditor, JavaMonacoEditorParams } from '../utils/editor'
import Dialog from './Dialog'
import Loading from './Loading'
import { Link } from 'react-router-dom'
import React from 'react'

/**
 * @param initValue khởi tạo mã của bạn
 * @param sampleFile đường dẫn tĩnh file của bạn ( file chứa trong folder resources)
 * -- ex: resources/com/example/app/hello.java
 * @return {*}
 */
const Editor = ({
  connectConfig,
  containerId,
  langConfig,
  initValue = '',
  vsCodeSettingsJson,
  sampleFile,
  onChange
}: JavaMonacoEditorParams & {
  initValue?: string
  vsCodeSettingsJson: string
  sampleFile?: string
  onChange?: (newValue: string) => void 
}) => {
  const [init, setInit] = useState(false)
  const [data, setData] = useState<JavaMonacoEditor>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    const javaEditor = new JavaMonacoEditor({
      containerId,
      langConfig,
      connectConfig
    })
    setError(undefined)
    setInit(false)
    run(javaEditor)
      .then(() => {
        setData(javaEditor)
        javaEditor.editor.onDidChangeModelContent(() => {
          const currentValue = javaEditor.editor.getValue()
          onChange?.(currentValue)
        })
      })
      .catch((err) => {
        javaEditor?.dispose()
        setError(JSON.stringify(err?.stack || err?.toString?.()))
      })
      .finally(() => {
        setInit(true)
      })

    return () => {
      javaEditor?.dispose?.()
    }
  }, [])

  useEffect(() => {
    if (data) {
      data.editor.setValue(initValue)
    }
  }, [initValue])


  const run = async (javaEditor: JavaMonacoEditor) => {
    await updateUserConfiguration(vsCodeSettingsJson)

    if (sampleFile) {
      const file = await fetch(sampleFile)
      const text = await file.text()
      initValue = text
    }


    console.log(initValue)
    await javaEditor.createEditor(initValue)

    
    

    javaEditor.initializeJavaLanguageServer()

    return Promise.resolve()
  }

  const onRun = () => {
    alert(JSON.stringify(data?.editor.getValue()))
  }
  const onClear = () => {
    data?.editor.setValue('')
  }

  const onCancel = () => {
    window.location.reload()
  }

  return !error ? (
    <>
      <>
        {/* <div className='text-left flex overflow-x-auto gap-2 pb-2 border-b border-gray-500'>
          <Link to={'/'}>
            <h1 className='text-white  select-none  text-[30px]'>CODE EDITOR</h1>
          </Link>
          <div className='separate w-[1px] h-[100%] bg-gray-500 mx-2'></div>
          <button className='rounded-none px-4 py-1 ' onClick={onRun}>
            Run Code
          </button>
          <button className='rounded-none px-4 py-1 ' onClick={onClear}>
            Clear Code
          </button>
        </div> */}
      </>
      {!init && (
        <div className='w-screen fixed top-0 left-0 h-screen flex justify-center items-center'>
          <Loading />
        </div>
      )}
      <div className='flex-1 h-[100%]' hidden={!init} id={containerId}></div>
    </>
  ) : (
    <Dialog title='Có lỗi xảy ra' desc={error} onCancel={onCancel} />
  )
}

export default React.memo(Editor)
