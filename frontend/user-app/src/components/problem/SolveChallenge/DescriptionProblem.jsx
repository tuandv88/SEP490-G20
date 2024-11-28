
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { BookOpenCheck } from 'lucide-react'
import PreCoppy from '@/components/ui/PreCoppy'
import DescriptionLoading from '@/components/loading/DescriptionLoading'

const DescriptionProblem = ({ description, loading, titleProblem }) => {

  return (
    <div className='h-fit'>
      {loading ? (
        <DescriptionLoading />
      ) : (
        <div className='bg-bGprimary text-gray-300 p-6 mx-auto font-sans h-full pt-[1px]'>                      
          <div className='p-3 rounded-lg flex items-center mb-10 mt-10 w-full border border-spacing-10'>
            <BookOpenCheck className='inline mr-4' size={40} color='#ffffff' />
            <h1 className=' text-white text-2xl font-bold'>{titleProblem}</h1>
          </div>

          <hr className='border-b-2 border-gray-100 mb-6 mt-6 overflow-visible' />

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
      )}
    </div>
  )
}

export default React.memo(DescriptionProblem)
