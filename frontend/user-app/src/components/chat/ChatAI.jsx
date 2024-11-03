/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ChevronDown, HelpCircle, Plus, Search, Send, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import { ScrollArea } from '../ui/scroll-area'

const ChatAI = () => {
  const [messages, setMessages] = useState([
    { role: 'user', content: 'Write a 100-character meta description for my blog post about digital marketing.' },
    {
      role: 'assistant',
      content: 'Master the art of digital marketing with expert strategies for online success. Unlock growth now!'
    },
    { role: 'user', content: 'Provide a UX design tip I can share on LinkedIn.' },
    {
      role: 'assistant',
      content:
        'UX tip: Prioritize clarity over complexity. Keep interfaces simple and intuitive to enhance user satisfaction and engagement. #UserExperience #UXDesign'
    }
  ])
  const [input, setInput] = useState('')
  const [previousChats] = useState([
    { id: 1, title: 'What cross-selling oppo...', subtitle: 'to provide you with more...' },
    { id: 2, title: 'What are some common...', subtitle: 'to provide you with more...' },
    { id: 3, title: 'Give me an example of...', subtitle: 'to provide you with more...' },
    { id: 4, title: 'Write a 100-characte...', subtitle: 'Master the art of digital marketi...' },
    { id: 5, title: 'Compose a blog post of...', subtitle: 'to provide you with more...' }
  ])

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }])
      setInput('')
      // Here you would typically call your AI service to get a response
      // For this example, we'll just add a mock response after a short delay
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'This is a mock response from the AI.' }])
      }, 1000)
    }
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className='w-64 bg-white p-4 flex flex-col'>
        <Button className='bg-primary text-primary-foreground mb-4'>
          <Plus className='w-5 h-5 mr-2' /> New Chat
        </Button>
        <div className='relative mb-4'>
          <Input type='text' placeholder='Search' className='pl-8' />
          <Search className='absolute left-2 top-2.5 w-4 h-4 text-muted-foreground' />
        </div>
        <ScrollArea className='flex-1 -mx-4 px-4'>
          {previousChats.map((chat) => (
            <Button key={chat.id} variant='ghost' className='w-full justify-start text-left mb-1 px-2'>
              <div className='truncate'>
                <div className='font-medium truncate'>{chat.title}</div>
                <div className='text-sm text-muted-foreground truncate'>{chat.subtitle}</div>
              </div>
            </Button>
          ))}
          <Button variant='ghost' className='w-full justify-start text-left mb-1 px-2'>
            <ChevronDown className='w-4 h-4 mr-2' /> Show more
          </Button>
        </ScrollArea>
        <div className='mt-auto pt-4'>
          <Button variant='ghost' className='w-full justify-start mb-2'>
            <Settings className='w-5 h-5 mr-2' /> Settings
          </Button>
          <Button variant='ghost' className='w-full justify-start'>
            <HelpCircle className='w-5 h-5 mr-2' /> Help
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className='flex-1 flex flex-col'>
        <div className='bg-white p-4 shadow-sm'>
          <h1 className='text-xl font-semibold'>Chat</h1>
        </div>
        <ScrollArea className='flex-1 p-4'>
          <div className='space-y-4'>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        message.role === 'user'
                          ? 'https://cdn.dribbble.com/users/2400293/screenshots/16527147/media/f079dc5596a5fb770016c4ea506cd77b.png?resize=840x630&vertical=center'
                          : 'https://static.vecteezy.com/system/resources/previews/008/386/481/non_2x/ic-or-ci-initial-letter-logo-design-vector.jpg'
                      }
                    />
                    <AvatarFallback>{message.role === 'user' ? '' : 'AI'}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium mb-1'>{message.role === 'user' ? '' : ''}</span>
                    <div
                      className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className='bg-white p-4 border-t'>
          <div className='flex items-center'>
            <Input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter a prompt here...'
              className='flex-1 mr-2'
            />
            <Button onClick={handleSend}>
              <Send className='w-5 h-5' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatAI
