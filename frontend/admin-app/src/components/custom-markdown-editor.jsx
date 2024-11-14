import React, { useState, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import rehypeSanitize from 'rehype-sanitize'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import { Bold, Italic, Heading, List, ListOrdered, Minus, Image, Code, Link, Quote } from 'lucide-react'

const CustomMarkdownEditor = ({ value, onChange, placeholder }) => {
  const [selectedTab, setSelectedTab] = useState('write')

  const handleChange = useCallback(
    (newValue) => {
      if (onChange) {
        onChange(newValue)
      }
    },
    [onChange]
  )

  return (
    <div data-color-mode='light' className='w-full overflow-hidden border rounded-md shadow-sm'>
      <MDEditor
        value={value}
        onChange={handleChange}
        previewOptions={{
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
