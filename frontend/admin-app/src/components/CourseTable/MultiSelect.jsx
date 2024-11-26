import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown } from 'lucide-react'

export default function MultiSelect({ options, placeholder, onChange, value, resetKey, isOpen, setIsOpen, icon }) {
  const [selectedItems, setSelectedItems] = useState(value)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setSelectedItems(value || [])
  }, [value, resetKey])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsOpen])

  const toggleItem = (item) => {
    const newSelectedItems = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item]
    setSelectedItems(newSelectedItems)
    onChange(newSelectedItems.length > 0 ? newSelectedItems : undefined)
  }

  return (
    <div className='relative inline-block' ref={dropdownRef}>
      <Button variant='outline' onClick={() => setIsOpen(!isOpen)} className='w-[200px] justify-between'>
        {icon}
        {selectedItems.length > 0 ? `${selectedItems.length} selected` : placeholder}
        <ChevronDown className='w-4 h-4 ml-2' />
      </Button>
      {isOpen && (
        <div className='absolute mt-2 w-[200px] rounded-md border bg-popover p-2 shadow-md z-50'>
          {options.map((option) => (
            <div
              key={option}
              className='flex items-center p-1 space-x-2 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground'
            >
              <Checkbox checked={selectedItems.includes(option)} onCheckedChange={() => toggleItem(option)} />
              <label className='w-full cursor-pointer'>{option}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  resetKey: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  icon: PropTypes.node
}
