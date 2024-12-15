import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown } from 'lucide-react'

export default function MultiSelect({ options, placeholder, onChange, value, resetKey, isOpen, setIsOpen }) {
  const dropdownRef = useRef(null)

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

  const handleSelect = (option) => {
    onChange(option === value ? '' : option)
    setIsOpen(false)
  }

  return (
    <div className='relative inline-block' ref={dropdownRef}>
      <Button variant='outline' onClick={() => setIsOpen(!isOpen)} className='w-[200px] justify-between'>
        {value || placeholder}
        <ChevronDown className='w-4 h-4 ml-2' />
      </Button>
      {isOpen && (
        <div className='absolute mt-2 w-[200px] rounded-md border bg-popover p-2 shadow-md z-50'>
          {options.map((option) => (
            <div
              key={option}
              className='flex items-center p-2 space-x-2 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground'
              onClick={() => handleSelect(option)}
            >
              <div className='flex-1'>{option}</div>
              {value === option && <Check className='w-4 h-4' />}
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
  value: PropTypes.string,
  resetKey: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired
}
