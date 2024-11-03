/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import PreCoppy from '../ui/PreCoppy'
import { BookOpenCheck, Frown } from 'lucide-react'
import DescriptionLoading from '../loading/DescriptionLoading'

const Description = ({ description, videoSrc, loading, titleProblem }) => {
  if (!description) {
    return (
      <div className='bg-gray-900 text-gray-300 h-full p-6 mx-auto font-sans flex justify-items-center items-center'>
        <div className='bg-slate-300 h-[150px] flex items-center  font-medium text-black p-3 rounded-lg'>
          <Frown className='mr-3' size={48} color='#22bfbc' />
          <p>No lecture have been chosen yet. Please choose 1 lecture.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {loading ? (
        <DescriptionLoading />
      ) : (
        <div className='bg-gray-900 text-gray-300 p-6 mx-auto font-sans'>
          <div className='relative pb-[56.25%] h-0'>
            <video className='absolute top-0 left-0 w-full h-full' controls src={videoSrc} title='Lecture Video'>
              Your browser does not support the video tag.
            </video>
          </div>

          <div className='p-3 rounded-lg flex items-center mb-10 mt-10 w-full border border-spacing-10'>
            <BookOpenCheck className='inline mr-4' size={40} color='#ffffff' />
            <h1 className=' text-white text-2xl font-bold'>{titleProblem}</h1>
          </div>

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

export default React.memo(Description)
