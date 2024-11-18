import React, { useState, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import remarkBreaks from 'remark-breaks'
import rehypeSanitize from 'rehype-sanitize'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import { Bold, Italic, Heading, List, ListOrdered, Minus, Image, Code, Link, Quote } from 'lucide-react'

const CustomMarkdownEditor = ({ value, onChange, placeholder }) => {
  const [selectedTab, setSelectedTab] = useState('write')

  const test = { value: null }
  const handleChange = useCallback(
    (newValue) => {
      if (onChange) {
        onChange(newValue)
        test.value = newValue
      }
    },
    [onChange]
  )
  if (test.value !== null) {
    console.log('test.value', test.value)
  }
  return (
    <div data-color-mode='light' className='w-full overflow-hidden border rounded-md shadow-sm '>
      <MDEditor
        className='custom-list'
        value={value}
        onChange={handleChange}
        previewOptions={{
          // Thêm remarkBreaks vào cấu hình
          remarkPlugins: [remarkBreaks],
          rehypePlugins: [[rehypeSanitize]]
        }}
        textareaProps={{
          placeholder: placeholder
        }}
      />
    </div>
  )
}

export default CustomMarkdownEditor
