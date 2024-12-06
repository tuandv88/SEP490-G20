import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { X, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { JAVA_LANGUAGE_CONFIG, JAVA_LANGUAGE_EXT_POINT, JAVA_LANGUAGE_ID } from '@/lib/code-editor/constants'

import { motion, AnimatePresence } from 'framer-motion'
import { ProblemAPI } from '@/services/api/problemApi'
import lodash, { isEmpty } from 'lodash'
import Editor from '@/lib/code-editor/components/Editor'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'

import { LearningAPI } from '@/services/api/learningApi'
import { QuizAPI } from '@/services/api/quizApi'
import { CustomConfirmModal } from '../ui/button-confirm-modal'
import useStore from '@/data/store'
import Popup from '../ui/popup'
import PreferenceNavQuizProblem from '../quiz/PreferenceNavQuizProblem'
import DescriptionQuizProblem from '../quiz/DescriptionQuizProblem'
import TestcaseInterfaceQuiz from '../quiz/TestcaseInterfaceQuiz'
import { useToast } from '@/hooks/use-toast'
export default function QuizSuggestUser({ quiz, answer, timeLimit, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [idCodeSnippetQuestions, setIdCodeSnippetQuestions] = useState()
  const [codeSnippetQuestion, setCodeSnippetQuestion] = useState()
  const currentQuestion = quiz.questions[currentQuestionIndex]
  const [templates, setTemplates] = useState()
  const [testCase, setTestCase] = useState()
  const setCodeRunQuiz = useStore((state) => state.setCodeRunQuiz)
  const [codeRunPro, setCodeRunPro] = useState()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()
  const testCasesQuiz = useStore((state) => state.testCasesQuiz)
  const [isOpen, setIsOpen] = useState(false)

  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [codeSnippets, setCodeSnippets] = useState({})
  const [problemIds, setProblemIds] = useState({})

  const { toast } = useToast()

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  // Chuyển đổi thời gian từ phút sang giây
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitLater()
      return
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [timeLeft])

  const handleSubmitLater = () => {
    // Gọi hàm onComplete khi hết thời gian
    if (onComplete) {
      onComplete()
    }
  }

  useEffect(() => {
    if (answer && answer.questionAnswers) {
      const initialCodeSnippets = {}
      const initialAnswers = {}

      for (const questionAnswer of answer.questionAnswers) {
        const { questionId, questionAnswerId, problem } = questionAnswer

        if (problem && problem.submission) {
          // Nếu có mã code, lưu trữ nó
          initialCodeSnippets[questionId] = problem.submission.solutionCode
        } else if (questionAnswerId) {
          // Nếu có câu trả lời, lưu trữ nó
          initialAnswers[questionId] = questionAnswerId
        }
      }

      setCodeSnippets(initialCodeSnippets)
      setAnswers(initialAnswers)
    }
  }, [answer])

  const handleEditorChange = lodash.debounce((value) => {
    const currentQuestion = quiz.questions[currentQuestionIndex]
    const questionId = currentQuestion.id

    // Lưu mã code vào state cho từng câu hỏi
    setCodeSnippets((prev) => ({
      ...prev,
      [questionId]: value
    }))

    setCodeRunPro(value)
    setCodeRunQuiz(value)
    console.log('value: ', value)
  }, 500)

  useEffect(() => {
    const currentQuestion = quiz.questions[currentQuestionIndex]
    const questionId = currentQuestion.id

    if (currentQuestion.questionType === 'CodeSnippet') {
      // Khôi phục mã code từ state hoặc sử dụng templates nếu chưa có mã code nào được lưu
      const savedCode = codeSnippets[questionId] || templates
      setCodeRunPro(savedCode)
      setCodeRunQuiz(savedCode)
      const savedProblemId = problemIds[questionId] || currentQuestion.problemId
      setIdCodeSnippetQuestions(savedProblemId)
    } else {
      // Khôi phục câu trả lời từ state
      const savedAnswer = answers[questionId]
      if (savedAnswer) {
        switch (currentQuestion.questionType) {
          case 'MultipleChoice':
          case 'TrueFalse':
            // Đặt giá trị cho câu hỏi dạng lựa chọn đơn
            setSelectedAnswer(Array.isArray(savedAnswer) ? savedAnswer[0] : savedAnswer)
            break
          case 'MultipleSelect':
            // Đặt giá trị cho câu hỏi dạng lựa chọn nhiều
            if (Array.isArray(savedAnswer)) {
              setSelectedAnswers(
                savedAnswer.reduce((acc, answerId) => {
                  acc[answerId] = true
                  return acc
                }, {})
              )
            } else if (typeof savedAnswer === 'object') {
              // Chuyển đổi đối tượng thành mảng nếu cần
              const answerArray = Object.keys(savedAnswer).filter((key) => savedAnswer[key] === true)
              setSelectedAnswers(
                answerArray.reduce((acc, answerId) => {
                  acc[answerId] = true
                  return acc
                }, {})
              )
            } else {
              console.warn(`Expected an array or object for MultipleSelect answers, but got:`, savedAnswer)
            }
            break
          default:
            console.warn(`Unsupported question type: ${currentQuestion.questionType}`)
        }
      }
    }
  }, [currentQuestionIndex, templates, codeSnippets, answers, quiz.questions])

  useEffect(() => {
    for (const question of quiz?.questions) {
      if (question.questionType === 'CodeSnippet') {
        setIdCodeSnippetQuestions(question.problemId)
        fetchProblem(question.problemId)
      }
    }
  }, [quiz])

  const fetchProblem = async (problemId) => {
    const data = await ProblemAPI.getProblem(problemId)
    setCodeSnippetQuestion(data)
    setTemplates(data?.problemDto?.templates?.Java)
    handleArrayToDictionary(data?.problemDto?.testCases)
  }

  const handleAnswerChange = (value, isMultipleSelect = false) => {
    const currentQuestion = quiz.questions[currentQuestionIndex]
    const questionId = currentQuestion.id

    if (isMultipleSelect) {
      setAnswers((prev) => {
        const currentAnswers = new Set(prev[questionId] || [])

        // Thêm hoặc loại bỏ ID dựa trên giá trị `checked`
        Object.entries(value).forEach(([key, checked]) => {
          if (checked) {
            currentAnswers.add(key)
          } else {
            currentAnswers.delete(key)
          }
        })

        return {
          ...prev,
          [questionId]: Array.from(currentAnswers) // Chuyển đổi Set thành mảng
        }
      })
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: [value] // Đảm bảo lưu dưới dạng mảng
      }))
    }
  }

  const handleArrayToDictionary = (inputArray) => {
    if (!Array.isArray(inputArray)) {
      return
    }

    const dictionary = inputArray.reduce((acc, item, index) => {
      acc[index] = item.inputs
      return acc
    }, {})
    setTestCase(dictionary)
  }

  const [previousAnswers, setPreviousAnswers] = useState({})
  const [previousCodeRunPro, setPreviousCodeRunPro] = useState('')

  const saveAnswer = async (questionId, questionAnswerId) => {
    const answerIdArray = Array.isArray(questionAnswerId) ? questionAnswerId : [questionAnswerId]

    const question = {
      questionId: questionId,
      questionAnswerId: answerIdArray,
      problem: null
    }

    try {
      const response = await QuizAPI.submissionAnswer(answer.quizSubmissionId, question)
      console.log('Answer saved successfully')
    } catch (error) {
      console.error('Error saving answer:', error)
    }
  }

  const saveCodeSnippetAnswer = async (questionId, codeRunPro) => {
    const question = {
      questionId: questionId,
      questionAnswerId: null,
      problem: {
        problemId: idCodeSnippetQuestions,
        submission: {
          languageCode: 'Java',
          solutionCode: codeRunPro
        }
      }
    }

    try {
      const response = await QuizAPI.submitCodeSnippet(answer.quizSubmissionId, question)
      console.log('Code snippet saved successfully')
    } catch (error) {
      console.error('Error saving code snippet:', error)
    }
  }

  const handleNext = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex]
    let userAnswer = answers[currentQuestion.id] || [] // Assuming `answers` is an object storing user answers

    if (currentQuestion.questionType === 'MultipleSelect') {
      // Lọc các lựa chọn đã chọn
      //userAnswer = Object.keys(userAnswer).filter((key) => userAnswer[key])
      userAnswer = userAnswer.filter((answerId) => answerId)
    }

    let hasChanged = false

    if (currentQuestion.questionType === 'CodeSnippet') {
      // So sánh codeRunPro với giá trị trước đó
      hasChanged = codeRunPro !== previousCodeRunPro
    } else {
      // So sánh câu trả lời thông thường
      const previousAnswer = previousAnswers[currentQuestion.id] || []
      hasChanged = JSON.stringify(userAnswer) !== JSON.stringify(previousAnswer)
    }

    if (hasChanged) {
      if (currentQuestion.questionType === 'CodeSnippet') {
        // Gọi API cho CodeSnippet
        if (isEmpty(codeRunPro)) {
          saveCodeSnippetAnswer(currentQuestion.id, templates)
        } else {
          saveCodeSnippetAnswer(currentQuestion.id, codeRunPro)
        }
        // Cập nhật codeRunPro trước đó
        setPreviousCodeRunPro(codeRunPro)
      } else {
        // Gọi API cho các loại câu hỏi khác
        saveAnswer(currentQuestion.id, userAnswer)
        // Cập nhật câu trả lời trước đó
        setPreviousAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: userAnswer
        }))
      }
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsConfirmOpen(true) // Hiển thị hộp thoại xác nhận
  }

  const handleSubmitConfirm = async () => {
    handleNext()
    try {
      const response = await QuizAPI.submitQuiz(answer.quizSubmissionId)
      console.log('Quiz submitted successfully')
      toast({
        title: 'Quiz completed successfully!',
        description:
          'You will receive a schedule from the system for a moment, check in your profile in the Roadmap section.'
      })
      onComplete()
    } catch (error) {
      console.error('Error submitting quiz:', error)
    }
  }

  const handleRunCode = async () => {
    if (isEmpty(codeRunPro)) {
      setIsOpen(true)
      return
    }

    console.log('codeRunPro: ', codeRunPro)

    const submissionData = {
      createCodeExecuteDto: {
        languageCode: 'Java',
        solutionCode: codeRunPro,
        testCases: testCasesQuiz
      }
    }
    setLoading(true)
    try {
      const data = await LearningAPI.excuteCode(idCodeSnippetQuestions, submissionData)
      setResponse(data)
    } catch (error) {
      console.error('Error submitting code:', error)
      alert('Error occurred while submitting code')
    } finally {
      setLoading(false)
    }
  }

  const renderQuestion = () => {
    switch (currentQuestion.questionType) {
      case 'CodeSnippet':
        return (
          <div className='w-full h-[100%] rounded-md overflow-hidden'>
            <PreferenceNavQuizProblem onSubmit={handleRunCode} loading={loading}></PreferenceNavQuizProblem>
            {templates && (
              <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel defaultSize={40}>
                  <div className='h-full w-full overflow-auto'>
                    <DescriptionQuizProblem description={currentQuestion?.content} />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle className='resize-sha w-[3px]' />
                <ResizablePanel defaultSize={60}>
                  <ResizablePanelGroup direction='vertical'>
                    <ResizablePanel defaultSize={60}>
                      <div className='w-full h-full overflow-auto'>
                        <Editor
                          langConfig={{
                            extPoint: JAVA_LANGUAGE_EXT_POINT,
                            langId: JAVA_LANGUAGE_ID,
                            langConfig: JAVA_LANGUAGE_CONFIG
                          }}
                          vsCodeSettingsJson={JSON.stringify({
                            'editor.fontSize': 14,
                            'editor.lineHeight': 20,
                            'editor.fontFamily': 'monospace',
                            'editor.fontWeight': 'normal',
                            'editor.indentSize': 'tabSize',
                            'workbench.colorTheme': 'Default Dark Modern',
                            'editor.guides.bracketPairsHorizontal': 'active',
                            'editor.experimental.asyncTokenization': true
                          })}
                          connectConfig={{
                            fileUri: null,
                            url: null,
                            workspaceUri: null
                          }}
                          initValue={codeSnippets[currentQuestion.id] || codeRunPro}
                          //sampleFile='resources/com/example/app/Solution.java'
                          containerId={'editor'}
                          onChange={handleEditorChange}
                        />
                      </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle className='h-[3px] resize-sha overflow-hidden bg-slate-300' />
                    <ResizablePanel defaultSize={40}>
                      <div className='h-full w-full overflow-auto'>
                        <TestcaseInterfaceQuiz response={response} loading={loading} testCase={testCase} />
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </div>
        )
      case 'TrueFalse':
      case 'MultipleChoice':
        return (
          <RadioGroup value={selectedAnswer || ''} onValueChange={handleAnswerChange} className='space-y-2'>
            {currentQuestion.questionOptions.map((option) => (
              <div
                key={option.id}
                className='flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors'
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className='flex-grow cursor-pointer'>
                  {option.content}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )
      case 'MultipleSelect':
        return (
          <div className='space-y-2'>
            {currentQuestion.questionOptions.map((option) => (
              <div
                key={option.id}
                className='flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors'
              >
                <Checkbox
                  id={option.id}
                  checked={selectedAnswers[option.id] || false}
                  onCheckedChange={(checked) => {
                    handleAnswerChange({ [option.id]: checked }, true)
                  }}
                />
                <Label htmlFor={option.id} className='flex-grow cursor-pointer'>
                  {option.content}
                </Label>
              </div>
            ))}
          </div>
        )
      default:
        return <p>Unsupported question type: {currentQuestion.questionType}</p>
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white w-[90vw] h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col'>
        <Card className='border-0 flex flex-col h-full'>
          <CardHeader className='relative'>
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-4 top-4'
              onClick={onComplete}
              aria-label='Close quiz'
            >
              <X className='h-4 w-4' />
            </Button>
            <div className='flex justify-center items-center mt-2'>
              <p className='text-lg font-semibold'>
                Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} minutes
              </p>
            </div>
            <CardTitle className='text-2xl font-bold text-indigo-700'>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </CardTitle>
            <CardDescription>
              {currentQuestion.questionType} - {currentQuestion.questionLevel}
            </CardDescription>
          </CardHeader>
          <CardContent className='flex-grow overflow-auto'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-4 h-full flex flex-col'
              >
                <div className='prose max-w-none mb-4'>
                  {currentQuestion.questionType !== 'CodeSnippet' && (
                    <div className='prose max-w-none mb-4'>
                      <div dangerouslySetInnerHTML={{ __html: currentQuestion.content }} />
                    </div>
                  )}
                </div>
                <div className='flex-grow h-[100%]'>{renderQuestion()}</div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className='border-t pt-4'>
            <div className='flex justify-between w-full'>
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant='outline'
                className='flex items-center'
              >
                <ChevronLeft className='mr-2 h-4 w-4' /> Previous
              </Button>
              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <Button onClick={handleSubmit} className='bg-green-600 hover:bg-green-700'>
                  Submit <Send className='ml-2 h-4 w-4' />
                </Button>
              ) : (
                <>
                  <Button onClick={handleSubmit} className='bg-green-600 hover:bg-green-700'>
                    Submit <Send className='ml-2 h-4 w-4' />
                  </Button>
                  <Button onClick={handleNext} className='flex items-center'>
                    Next <ChevronRight className='ml-2 h-4 w-4' />
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
      <Popup
        isOpen={isOpen}
        onComplete={() => setIsOpen(false)}
        message='Are you sure you want to submit your answer?'
      />
      <CustomConfirmModal
        isOpen={isConfirmOpen}
        onComplete={() => setIsConfirmOpen(false)}
        onConfirm={handleSubmitConfirm}
        title='Submit Quiz'
        content='Are you sure you want to submit your answer?'
        confirmText='Yes, I am sure'
        cancelText='No, cancel'
      />
    </div>
  )
}
