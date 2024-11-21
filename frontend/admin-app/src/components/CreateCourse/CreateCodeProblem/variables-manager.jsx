import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

export default function VariablesManager({ variables, setVariables }) {
  const addVariable = () => {
    setVariables([...variables, { name: '', value: '' }])
  }

  const updateVariable = (index, value) => {
    const newVariables = [...variables]
    newVariables[index].name = value
    setVariables(newVariables)
  }

  const removeVariable = (index) => {
    const newVariables = variables.filter((_, i) => i !== index)
    setVariables(newVariables)
  }

  return (
    <div>
      <Label>Variables</Label>
      {variables.map((variable, index) => (
        <div key={index} className='flex mt-2 space-x-2'>
          <Input
            placeholder='Variable name'
            value={variable.name}
            onChange={(e) => updateVariable(index, e.target.value)}
          />
          <Button onClick={() => removeVariable(index)} variant='destructive' size='icon'>
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      ))}
      <Button onClick={addVariable} type='button' variant='outline' size='sm' className='mt-2'>
        <Plus className='w-4 h-4 mr-2' /> Add Variable
      </Button>
    </div>
  )
}
