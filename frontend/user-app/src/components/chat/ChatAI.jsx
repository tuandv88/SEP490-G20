/* eslint-disable no-unused-vars */
'use client'

import React, { useState } from 'react'
import { Send, Plus, X, RotateCcw, History, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function Component() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'user',
      content: 'Write a 100-character meta description for my blog post about digital marketing.',
      timestamp: '5m ago'
    },
    {
      id: 2,
      role: 'assistant',
      content: 'Master the art of digital marketing with expert strategies for online success. Unlock growth now!',
      timestamp: '4m ago'
    },
    { id: 3, role: 'user', content: 'Provide a UX design tip I can share on LinkedIn.', timestamp: '3m ago' },
    {
      id: 4,
      role: 'assistant',
      content:
        'UX tip: Prioritize clarity over complexity. Keep interfaces simple and intuitive to enhance user satisfaction and engagement. #UserExperience #UXDesign',
      timestamp: '2m ago'
    }
  ])
  const [input, setInput] = useState('')

  const chatHistory = [
    { id: 5, role: 'user', content: 'Chào hỏi và hỗ trợ lập trình', timestamp: '10m ago' },
    { id: 6, role: 'user', content: 'Cải thiện xác thực dữ liệu và xử lý lỗi', timestamp: '1d ago' },
    { id: 7, role: 'user', content: 'Xử lý dữ liệu API để hiển thị chương và bài giảng', timestamp: '3d ago' },
    { id: 8, role: 'user', content: 'Vấn đề với việc log testCase trong React', timestamp: '4d ago' }
  ]

  const filteredHistory = chatHistory.filter((chat) => chat.content.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { id: messages.length + 1, role: 'user', content: input, timestamp: 'Just now' }
      setMessages([...messages, newMessage])
      setInput('')
      // Here you would typically call your AI service to get a response
      // For this example, we'll just add a mock response after a short delay
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          role: 'assistant',
          content: 'This is a mock response from the AI.',
          timestamp: 'Just now'
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 1000)
    }
  }

  return (
    <div className='flex bg-[#1E1E1E] text-white h-[calc(100vh-6rem)]'>
      {/* Chat History Sidebar */}
      {isHistoryOpen && (
        <div className='w-80 bg-[#2D2D2D] border-r border-gray-700'>
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
            <Input
              type='text'
              placeholder='Search chats...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full bg-[#3D3D3D] text-white placeholder-gray-400'
            />
          </div>
          <ScrollArea className='h-[calc(100vh-120px)]'>
            {filteredHistory.map((chat) => (
              <div key={chat.id} className='p-4 hover:bg-[#3D3D3D] cursor-pointer border-b border-gray-700'>
                <div className='flex items-start gap-3'>
                  <Square size={16} className='mt-1' />
                  <div>
                    <p className='text-sm'>{chat.content}</p>
                    <span className='text-xs text-gray-400'>{chat.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}

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
            <Button variant='ghost' size='icon' className='hover:bg-[#3D3D3D] rounded'>
              <Plus size={18} />
            </Button>
            <Button variant='ghost' size='icon' className='hover:bg-[#3D3D3D] rounded'>
              <RotateCcw size={18} />
            </Button>
            <Button variant='ghost' size='icon' className='hover:bg-[#3D3D3D] rounded'>
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <ScrollArea className='flex-1 p-4'>
          <div className='space-y-4'>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        message.role === 'user'
                          ? '/placeholder.svg?height=40&width=40'
                          : '/placeholder.svg?height=40&width=40'
                      }
                    />
                    <AvatarFallback>{message.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium mb-1'>{message.role === 'user' ? 'You' : 'ChatAI'}</span>
                    <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-600' : 'bg-[#3D3D3D]'}`}>
                      {message.content}
                    </div>
                    <span className='text-xs text-gray-400 mt-1'>{message.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className='border-t border-gray-700 p-4 sticky bottom-0 bg-black'>
          <div className='flex items-center gap-4'>
            <Input
              type='text'
              placeholder='Type a message...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='flex-1 bg-[#3D3D3D] text-white placeholder-gray-400'
            />
            <Button onClick={handleSend} className='bg-blue-600 hover:bg-blue-700'>
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
