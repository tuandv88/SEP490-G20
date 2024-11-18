/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Send, Plus, X, History, Square, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import useStore from '@/data/store'

const ChatAI = ({ lectureId, problemId }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { connection, messages: initialMessages } = useSignalRConnection(import.meta.env.VITE_SIGNALR_URL)
  const [messages, setMessages] = useState( [])
  const [chatHistory, setChatHistory] = useState([])
  // const [selectedConversationId, setSelectedConversationId] = useState(null)
  const selectedConversationId = useStore((state) => state.selectedConversationId)
  const setSelectedConversationId = useStore((state) => state.setSelectedConversationId)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const codeRun = useStore((state) => state.codeRun)
  const codeRunRef = useRef(codeRun);

  useEffect(() => {
    codeRunRef.current = codeRun;
  }, [codeRun]);


  useEffect(() => {
    scrollToBottom()
  }, [messages])


  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const data = await ChatAPI.getConversation()
        setChatHistory(data.conversations.data)     
      } catch (error) {
        console.error('Error fetching conversation:', error)
      }
    }

    const fetchMessage = async () => {
      try {
        const data = await ChatAPI.getMessage(selectedConversationId)
        setMessages(data.messages.data.reverse())       
        setSelectedConversationId(selectedConversationId)
      } catch (error) {
        console.error('Error fetching message:', error)
      }
    }
    
    
    fetchConversation()
    if(selectedConversationId !== null) {
      fetchMessage()
    }
  }, [selectedConversationId])


  const handleSend = async () => {
    if (message.trim() !== '') {
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

        setSelectedConversationId(conversationId)
        setIsHistoryOpen(false)   
  }

  const handleNewChat = () => {
    setSelectedConversationId(null)
    setMessages([])
  }

  return (
    <div className='flex bg-bGprimary text-white h-[calc(100vh-3rem)]'>
      {/* Chat History Sidebar */}
      <div
        style={{
          height: 'inherit'
        }}
        className={`fixed right-0 w-80 bg-[#2D2D2D] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isHistoryOpen ? 'translate-x-0 z-10' : 'translate-x-full z-10'
        }`}
      >
        <div className='p-4 border-b border-gray-700'>
          <div className='flex justify-between items-center mb-4'>
          <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsHistoryOpen(false)}
              className='hover:bg-gray-700 rounded'
            >
              <X size={18} />
            </Button>
            <h2 className='text-lg font-semibold'>All Chats</h2>           
          </div>
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
        <div className='h-[52px] border-b border-gray-700 flex items-center px-4 justify-between sticky top-0 bg-[#1f2937] z-[1]'>
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
          
          <div className='flex items-center gap-2'>
            <h1 className='font-semibold'>CHAT</h1>
          </div>
          
        </div>

        {/* Chat Messages Area */}
        <ScrollArea className='flex-1 p-4'>
          {messages.length > 0 ? (
                        <div className='space-y-4'>
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${message.senderType === 'User' ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`flex w-full items-start space-x-2 ${message.senderType === 'User' ? 'flex-row-reverse space-x-reverse' : ''}`}
                            >
                              {message.senderType !== 'User' && (
                                <Avatar>
                                  <AvatarImage
                                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJLfI1-UONOCM_xB1cr7iD0rDkT3YGINyXhw&s'
                                  />
                                  <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                              )}
                              <div className='flex flex-col overflow-x-auto'>
                                
                                <div
                                  className={`prose prose-invert max-w-fit overflow-x-auto !text-white p-3 rounded-lg ${message.senderType === 'User' ? 'bg-[#3D3D3D]' : ''} markdown-chat markdown-chat-a markdown-chat-ol-li `}
                                >
                                  <ReactMarkdown
                                    className='custom-markdown list-decimal marker:text-white prose-h3:text-[#B0BEC5] prose-h4:text-[#B0BEC5] markdown-chat-p'
                                    components={{
                                      code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline && match ? (
                                          <div className='relative overflow-x-auto'>
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
                                      },
                                      a({ href, children, ...props }) {
                                        return (
                                          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                                            {children}
                                          </a>
                                        )
                                      }
                                    }
                                  }
                                  >
                                    {message.content}
                                  </ReactMarkdown>
                                  
                                  {message.referenceLinks && (
                                    <div className='flex flex-wrap gap-2'>
                                      {message.referenceLinks.map((link, index) => (
                                        <div key={index} className='flex items-center gap-2 px-4 bg-gray-300 rounded-full'>
                                          <div className='flex items-center justify-center w-3 h-3 text-xs text-black font-medium rounded-full bg-[#ffe4ca]'>
                                            {index + 1}
                                          </div>
                                          <span className='text-[11px] markdown-chat-a markdown-chat-p'>
                                            <ReactMarkdown
                                            components={{
                                              a: ({ node, ...props }) => (
                                                <a {...props} target="_blank" rel="noopener noreferrer">
                                                  {props.children}
                                                </a>
                                              ),
                                            }}
                                            >{link}</ReactMarkdown>
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
                        <div ref={messagesEndRef} />
                      </div>
          ) : (
            <ChatDefaultScreen />
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className='border-t border-gray-700 p-4 sticky bottom-0 bg-[#1f2937]'>        
          <div className="flex items-end gap-2">
        <div className="relative flex-grow">
          <Textarea 
            //value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask ChatAI..." 
            className="min-h-[90px] max-h-[200px] bg-gray-300 text-black placeholder:text-zinc-500 resize-none border-none focus-visible:ring-0 mb-2"
          />
        </div>
        <div className="flex items-center gap-2">          
          <Button
            type='submit'
            onClick={handleSend}
            disabled={isLoading}
            size="icon"
            className="bg-white text-black hover:bg-zinc-200 mb-2"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ChatAI)