/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Send, Plus, X, History, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import PreCoppy from '../ui/PreCoppy'
import ChatDefaultScreen from './ChatDefaultScreen'
import { Textarea } from '../ui/textarea'
import { useSignalRConnection } from '../hooks/useSignalRConnection'
import { ChatAPI } from '@/services/api/chatApi'
import { SIGNALR_URL } from '@/data/constants'

export default function Component({ lectureId, problemId }) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [codeResponse, setCodeResponse] = useState(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { connection, messages: initialMessages } = useSignalRConnection(SIGNALR_URL)
  const [messages, setMessages] = useState(initialMessages || [])
  const [chatHistory, setChatHistory] = useState([])
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  


  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const data = await ChatAPI.getConversation()
        setChatHistory(data.conversations.data)       
      } catch (error) {
        console.error('Error fetching conversation:', error)
      }
    }
    fetchConversation()
  }, [selectedConversationId])




  const handleSend = async () => {
    if (message.trim() ) {
      const newMessage = { id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1, senderType: 'User', content: message, timestamp: 'Just now', referenceLinks: [] }
      if (Array.isArray(messages)) {
        setMessages([...messages, newMessage])
      } else {
        console.error('messages is not an array:', messages)
        setMessages([newMessage]) // Khởi tạo lại nếu cần
      }
      //setMessages([...messages, newMessage])
      setMessage('')
      setIsLoading(true)

      if (connection) {
        const messageRequest = {
          Message: {
            ConversationId: selectedConversationId,
            LectureId: lectureId,
            ProblemId: problemId,
            // LectureId: 'e7b8f8e2-4c3b-4f8b-9f8e-2b4c3b4f8b9f',
            // ProblemId: '89980ac8-3d50-49af-9a65-9cdcda802e11',
            Content: message
          }
        }

        try {
          await connection.invoke('SendMessage', messageRequest).then((result) => {
            console.log('Message sent successfully:', result)
            const aiResponse = {
              id: messages.length + 2,
              senderType: 'AI',
              content: result.MessageAnswer.Content,
              timestamp: 'Just now',
              referenceLink: result.MessageAnswer.ReferenceLinks
            }            
            setMessages((prev) => [...prev, aiResponse])
            setIsLoading(false)
            if(selectedConversationId === null) {
              setSelectedConversationId(result.MessageAnswer.ConversationId)
              setChatHistory((prev) => [...prev, { id: result.MessageAnswer.ConversationId, title: result.MessageAnswer.Content.slice(0, 20)}])
            }
          })
        } catch (error) {
          console.error('Error sending message: ', error)
        }
      }
    }
  }
 
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChatClick = (conversationId) => {
    const fetchMessage = async () => {
      try {
        const data = await ChatAPI.getMessage(conversationId)
        setMessages(data.messages.data.reverse())
        setSelectedConversationId(conversationId)
        setIsHistoryOpen(false)
      } catch (error) {
        console.error('Error fetching message:', error)
      }
    }
    fetchMessage()
  }

  const handleNewChat = () => {
    setSelectedConversationId(null)
    setMessages([])
  }

  return (
    <div className='flex bg-[#1E1E1E] text-white h-[calc(100vh-6rem)]'>
      {/* Chat History Sidebar */}
      <div
        style={{
          height: 'inherit'
        }}
        className={`fixed left-0 w-80 bg-[#2D2D2D] shadow-lg transform transition-transform duration-300 ease-in-out  ${
          isHistoryOpen ? 'translate-x-0 z-10' : '-translate-x-full z-10'
        }`}
      >
        <div className='p-4 border-b border-gray-700'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold'>All Chats</h2>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsHistoryOpen(false)}
              className='hover:bg-gray-700 rounded'
            >
              <X size={18} />
            </Button>
          </div>
          {/* <Input
            type='text'
            placeholder='Search chats...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full bg-[#3D3D3D] text-white placeholder-gray-400'
          /> */}
        </div>
        <ScrollArea className='h-[calc(100vh-120px)] mb-4 scroll-container pb-[200px]'>
          {chatHistory.map((chat) => (
            <div onClick={() => handleChatClick(chat.id)} key={chat.id} className={`p-4 cursor-pointer border-b border-gray-700 ${selectedConversationId === chat.id ? 'bg-gray-500' : 'hover:bg-[#3D3D3D]'}`}>
              <div className='flex items-start gap-3'>
                <Square size={16} className='mt-1' />
                <div>
                  <p className='text-sm'>{chat.title}</p>
                  <span className='text-xs text-gray-400'>Just now</span>
                </div>
              </div>
            </div>
          ))}
          <div className='h-5'></div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col scroll-container'>
        {/* Header */}
        <div className='h-14 border-b border-gray-700 flex items-center px-4 justify-between sticky top-0 bg-black z-[1]'>
          <div className='flex items-center gap-2'>
            <h1 className='font-semibold'>CHAT</h1>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className='hover:bg-[#3D3D3D] rounded'
            >
              <History size={18} />
            </Button>
            <Button variant='ghost' size='icon' className='hover:bg-[#3D3D3D] rounded' onClick={handleNewChat}>
              <Plus size={18} />
            </Button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <ScrollArea className='flex-1 p-4'>
          {messages.length > 0 ? (
            <div className='space-y-4'>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.senderType === 'User' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`flex items-start space-x-2 ${message.senderType === 'User' ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          message.senderType === 'User'
                            ? ''
                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJLfI1-UONOCM_xB1cr7iD0rDkT3YGINyXhw&s'
                        }
                      />
                      <AvatarFallback>{message.senderType === 'User' ? '' : 'AI'}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium mb-1'>{message.senderType === 'User' ? '' : 'ChatAI'}</span>
                      <div
                        className={`prose !text-white p-3 rounded-lg ${message.senderType === 'User' ? 'bg-[#3D3D3D]' : ''} markdown-chat markdown-chat-a markdown-chat-ol-li `}
                      >
                        <ReactMarkdown
                          className='custom-markdown list-decimal marker:text-white prose-h3:text-white prose-h4:text-white markdown-chat-p'
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <div className='relative max-w-full overflow-x-auto'>
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
                          {message.content}
                        </ReactMarkdown>
                        {message.referenceLink && (
                          <div className='flex flex-wrap gap-2'>
                            {message.referenceLink.map((link, index) => (
                              <div key={index} className='flex items-center gap-2 px-4 bg-gray-300 rounded-full'>
                                <div className='flex items-center justify-center w-3 h-3 text-xs text-black font-medium rounded-full bg-[#ffe4ca]'>
                                  {index + 1}
                                </div>
                                <span className='text-[11px] markdown-chat-a markdown-chat-p'>
                                  <ReactMarkdown>{link}</ReactMarkdown>
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* <span className='text-xs text-gray-400 mt-1'>{message.timestamp}</span> */}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className='flex justify-start'>
                  <div className='flex items-start space-x-2'>
                    <Avatar>
                      <AvatarImage src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJLfI1-UONOCM_xB1cr7iD0rDkT3YGINyXhw&s' />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium mb-1'>ChatAI</span>
                      <div className='p-2 rounded-lg bg-gray-100'>
                        <div className='w-6 h-6 border-t-2 border-green-500 rounded-full animate-spin'></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
             
            </div>
          ) : (
            <ChatDefaultScreen />
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className='border-t border-gray-700 p-4 sticky bottom-0 bg-black'>
          <div className='flex items-center gap-4'>
            <Textarea
              type='text'
              placeholder='Type a message...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              onKeyDown={handleKeyDown}
              className='flex-1 bg-[#3D3D3D] text-white placeholder-gray-400 textarea-no-scroll'
            />
            <Button type='submit' onClick={handleSend} className='bg-blue-600 hover:bg-blue-700' disabled={isLoading}>
              <Send size={20} />
            </Button>
          </div>
          <div className='mt-2 text-xs text-gray-400 flex items-center gap-2'>
            <span>Ask followup (Ctrl+Shift+Y)</span>
            <span className='text-gray-500'>|</span>
            <span>↑ to select</span>
          </div>
        </div>
      </div>
    </div>
  )
}
