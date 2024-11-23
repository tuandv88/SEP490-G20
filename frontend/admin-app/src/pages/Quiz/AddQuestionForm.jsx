"use client"
import PropTypes from 'prop-types';
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { createQuestion } from "@/services/api/questionApi"
import { useToast } from "@/hooks/use-toast"
const QUESTION_TYPES = ["MultipleChoice", "MultipleSelect", "TrueFalse", "CodeSnippet"];
const QUESTION_LEVELS = ["EASY", "MEDIUM", "HARD", "EXPERT"];




  export function AddQuestionForm({ onClose , onAdd , quizId , setIsUpdate , isUpdate}) {
    const [content, setContent] = useState("")
    const [isActive, setIsActive] = useState(true)
    const [questionType, setQuestionType] = useState("MultipleChoice")
    const [questionLevel, setQuestionLevel] = useState("EASY")
    const [mark, setMark] = useState(1)
    const [questionOptions, setQuestionOptions] = useState([{ content: "", isCorrect: false }])
    const { toast } = useToast()
  const handleAddAnswer = () => {
    setQuestionOptions([...questionOptions, { content: "", isCorrect: false }])
  }

  const handleAnswerChange = (index, text) => {
    const newAnswers = [...questionOptions]
    newAnswers[index].content = text
    setQuestionOptions(newAnswers)
  }

  const handleCorrectAnswerChange = (index) => {
    const newAnswers = questionOptions.map((answer, i) => ({
      ...answer,
      isCorrect: questionType === "MultipleSelect" ? 
        (i === index ? !answer.isCorrect : answer.isCorrect) : 
        (i === index)
    }))
    setQuestionOptions(newAnswers)
  }

  const handleSubmit = async () => {
    const updatedQuestionOptions = questionOptions.map((option, index) => ({
        ...option,
        orderIndex: index
      }));
      const createQues = {
        createQuestionDto: {
            content,
            isActive,
            questionType,
            questionLevel,
            mark,
            questionOptions: updatedQuestionOptions
        }
    }
    console.log(createQues)
    // Here you would typically send the data to your backend
    try {
        const response = await createQuestion(createQues,quizId)
        setIsUpdate(!isUpdate)
        toast({
            title: "Question created successfully",
            description: "Question created successfully",
        })
    } catch (error) {
        toast({
            title: "Error creating question",
            description: error.message,
        })
    }
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">
              Is Active
            </Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="questionType" className="text-right">
              Question Type
            </Label>
            <Select onValueChange={(value) => setQuestionType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem  value="MultipleChoice">Multiple Choice </SelectItem>
                <SelectItem value="MultipleSelect">Multiple Select</SelectItem>
                <SelectItem value="TrueFalse">True/False</SelectItem>
                <SelectItem value="CodeSnippet">Code Snippet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="questionLevel" className="text-right">
              Question Level
            </Label>
            <Select onValueChange={(value) => setQuestionLevel(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select question level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
                <SelectItem value="EXPERT">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mark" className="text-right">
              Mark
            </Label>
            <Input
              id="mark"
              type="number"
              value={mark}
              onChange={(e) => setMark(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          {(questionType === "MultipleChoice" || questionType === "MultipleSelect") && (
            <>
              {questionOptions.map((answer, index) => (
                <div key={index} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`answer-${index}`} className="text-right">
                    Answer {index + 1}
                  </Label>
                  <Input
                    id={`answer-${index}`}
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="col-span-2"
                  />
                  <Switch
                    checked={answer.isCorrect}
                    onCheckedChange={() => handleCorrectAnswerChange(index)}
                  />
                </div>
              ))}
              <Button onClick={handleAddAnswer} className="mt-2">Add Answer</Button>
            </>
          )}
          {questionType === "TrueFalse" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Correct Answer</Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => setQuestionOptions([{ content: value, isCorrect: true },{content : value === "True" ? "False" : "True", isCorrect:false}])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="True">True</SelectItem>
                    <SelectItem value="False">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {questionType === "CodeSnippet" && (
            <Button>Create Problem Code Question</Button>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

AddQuestionForm.propTypes = {
    onClose: PropTypes.func.isRequired,

};