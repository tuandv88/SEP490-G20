/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const Description = ({ markdown }) => {
  return (
    <div className='bg-gray-900 text-gray-300 p-6 mx-auto font-sans'>
      <div className='relative pb-[56.25%] h-0'>
        <iframe
          className='absolute top-0 left-0 w-full h-full'
          src='https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/video/Object%20Oriented%20Programming%20-%20The%20Four%20Pillars%20of%20OOP.mp4'
          title='GOT MARKDOWN VIDEO'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
        ></iframe>
      </div>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter style={oneDark} language={match[1]} PreTag='div' {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className='bg-gray-300 text-black rounded px-1 py-0.3 text-sm font-mono' {...props}>
                {children}
              </code>
            )
          }
        }}
        className='prose prose-sm sm:prose lg:prose-lg'
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

export default function Component() {
  const markdown = `
# SEP490_G20


Given an array of integers \`nums\` and an integer \`target\`, return **indices of the two numbers** such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

Example 1:

\`\`\`java
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

Example 2:

\`\`\`java
Input: nums = [3,2,4], target = 6
Output: [1,2]
Explanation: Because nums[1] + nums[2] == 6, we return [1, 2].
\`\`\`

Example 3:

\`\`\`java
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`



\`\`\`java []
public class Main {
    public static void main(String[] args) {
        int n = 10; 
        System.out.println("Fibonacci of " + n + " is: " + fibonacci(n));
    }

    public static int fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}
\`\`\`
`

  return <Description markdown={markdown} />
}
