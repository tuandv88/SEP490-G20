import React, { useState, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor'
import remarkBreaks from 'remark-breaks'
import rehypeSanitize from 'rehype-sanitize'
import '@uiw/react-md-editor/markdown-editor.css' // Cập nhật đường dẫn
import '@uiw/react-markdown-preview/markdown.css'
import 'katex/dist/katex.min.css'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import PropTypes from 'prop-types'

const CustomMarkdownEditor = ({
  value,
  onChange,
  placeholder,
  height = 200,
  extraRemarkPlugins = [],
  extraRehypePlugins = []
}) => {
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
        className='custom-list'
        value={value}
        onChange={handleChange}
        height={height}
        previewOptions={{
          remarkPlugins: [remarkBreaks, remarkMath, ...extraRemarkPlugins],
          rehypePlugins: [rehypeSanitize, rehypeKatex, ...extraRehypePlugins]
        }}
        textareaProps={{
          placeholder: placeholder
        }}
      />
    </div>
  )
}

CustomMarkdownEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  height: PropTypes.number,
  extraRemarkPlugins: PropTypes.array,
  extraRehypePlugins: PropTypes.array
}

export default CustomMarkdownEditor
