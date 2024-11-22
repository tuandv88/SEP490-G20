import { useState } from "react"
import PropTypes from 'prop-types'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Edit, Trash2, ChevronDown } from 'lucide-react'

export function QuestionItem({ question, onEdit, onDelete, onToggleActive }) {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    // Implement edit functionality
  }

  const handleDelete = () => {
    onDelete(question.id)
  }



  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 mr-4">{question.content}</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{question.questionType}</span>
        </div>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="details">
          <AccordionTrigger>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p><strong>Level:</strong> {question.questionLevel}</p>
              <p><strong>Mark:</strong> {question.mark}</p>
              <p><strong>Answers:</strong></p>
              <ul className="list-disc pl-5">
                {question.answers.map((answer, index) => (
                  <li key={index} className={answer.isCorrect ? "text-green-600" : ""}>
                    {answer.text} {answer.isCorrect && "(Correct)"}
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

QuestionItem.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    questionType: PropTypes.string.isRequired,
    questionLevel: PropTypes.string.isRequired,
    mark: PropTypes.number.isRequired,
    answers: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      isCorrect: PropTypes.bool.isRequired,
    })).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
}

