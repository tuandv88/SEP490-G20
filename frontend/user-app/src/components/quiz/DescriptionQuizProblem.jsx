/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import PreCoppy from '../ui/PreCoppy'

const DescriptionQuizProblem = ({ description }) => {
  return (
    <div className='bg-bGprimary text-gray-300 p-6 mx-auto font-sans'>      
      <div className='prose max-w-fit prose-invert w-full markdown-des mt-5'>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div className='relative'>
                  <SyntaxHighlighter style={oneDark} language={match[1]} PreTag='div' {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                  <PreCoppy code={String(children)} />
                </div>
              ) : (
                <code
                  className='bg-gray-300 inline-block text-black rounded px-1 py-0.3 text-sm font-mono'
                  style={{ content: 'none' }}
                  {...props}
                >
                  {children}
                </code>
              )
            }
          }}
        >
          {description}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default React.memo(DescriptionQuizProblem)
