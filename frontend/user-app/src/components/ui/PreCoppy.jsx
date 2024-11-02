/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'

const PreCoppy = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className='absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm opacity-60 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      aria-label={isCopied ? 'Copied!' : 'Copy code'}
    >
      {isCopied ? <Check className='h-5 w-5 text-green-500' /> : <Copy className='h-5 w-5 text-gray-500' />}
    </button>
  )
}

export default PreCoppy
