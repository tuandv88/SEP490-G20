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
import TestcaseInterfaceQuiz from './TestcaseInterfaceQuiz'
import DescriptionQuizProblem from './DescriptionQuizProblem'
import PreferenceNavQuizProblem from './PreferenceNavQuizProblem'
import useStore from '../../data/store'
import Popup from '../ui/popup'
import { LearningAPI } from '@/services/api/learningApi'
import { QuizAPI } from '@/services/api/quizApi'
import { CustomConfirmModal } from '../ui/button-confirm-modal'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useCountdown } from '@/hooks/useCountdown'


const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

export default function QuizPopup({ quiz, answer, onClose, timeLimit, hasTimeLimit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [idCodeSnippetQuestions, setIdCodeSnippetQuestions] = useState()
  const [codeSnippetQuestion, setCodeSnippetQuestion] = useState()
  const currentQuestion = quiz.questions[currentQuestionIndex]
  const [templates, setTemplates] = useState({})
  const [testCase, setTestCase] = useState()
  const setCodeRunQuiz = useStore((state) => state.setCodeRunQuiz)
  const [codeRunPro, setCodeRunPro] = useState()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState({})
  const testCasesQuiz = useStore((state) => state.testCasesQuiz)
  const [isOpen, setIsOpen] = useState(false)

  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [codeSnippets, setCodeSnippets] = useState({})
  const [problemIds, setProblemIds] = useState({})

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [testCaseMap, setTestCaseMap] = useState({})

  const calculateRemainingTime = () => {
    if (!hasTimeLimit) return 0;
    
    if (!answer?.startTime) return timeLimit * 60;
    
    const startTime = new Date(answer.startTime);
    const now = new Date();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const remainingSeconds = (timeLimit * 60) - elapsedSeconds;
    
    return Math.max(0, remainingSeconds);
  };

  const timeLeft = useCountdown(
    hasTimeLimit ? calculateRemainingTime() : 0,
    async () => {
      if (hasTimeLimit) {
        await handleSubmitConfirm();
      }
    }
  );

  useEffect(() => {
    if (hasTimeLimit) {
      const remainingTime = calculateRemainingTime();
      if (remainingTime <= 0) {
        handleSubmitConfirm();
      }
    }
  }, []);



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
    const codeSnippetQuestions = quiz?.questions.filter(q => q.questionType === 'CodeSnippet')
    codeSnippetQuestions.forEach(question => {
      fetchProblem(question.problemId)
    })
  }, [quiz])

  const fetchProblem = async (problemId) => {
    const data = await ProblemAPI.getProblem(problemId)
    setCodeSnippetQuestion(data)
    
    // Lưu template theo problemId
    setTemplates(prev => ({
      ...prev,
      [problemId]: data?.problemDto?.templates?.Java
    }))
    
    if (data?.problemDto?.testCases) {
      const testCaseDict = handleArrayToDictionary(data?.problemDto?.testCases)
      setTestCaseMap(prev => ({
        ...prev,
        [problemId]: testCaseDict
      }))
    }
  }

  const handleArrayToDictionary = (inputArray) => {
    if (!Array.isArray(inputArray)) {
      return {}
    }

    return inputArray.reduce((acc, item, index) => {
      acc[index] = item.inputs
      return acc
    }, {})
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

  const handleSubmit = () => {
    setIsConfirmOpen(true);
  };

  const handleSubmitConfirm = async () => {
    try {
      // Lưu câu trả lời của câu hỏi hiện tại trước khi submit
      const currentQuestion = quiz.questions[currentQuestionIndex];
      let userAnswer = answers[currentQuestion.id] || [];

      if (currentQuestion.questionType === 'CodeSnippet') {
        // Lưu câu trả lời cho câu hỏi code
        if (isEmpty(codeRunPro)) {
          await saveCodeSnippetAnswer(currentQuestion.id, templates);
        } else {
          await saveCodeSnippetAnswer(currentQuestion.id, codeRunPro);
        }
      } else {
        // Lưu câu trả lời cho các loại câu hỏi khác
        await saveAnswer(currentQuestion.id, userAnswer);
      }

      // Submit quiz
      const response = await QuizAPI.submitQuiz(answer.quizSubmissionId);
      
      // Đóng các modal và cập nhật trạng thái
      setIsConfirmOpen(false);     
      onClose(true);    
    } catch (error) {
      console.error('Error submitting quiz:', error);      
      setIsConfirmOpen(false);
    }
  };

  const handleCancelSubmit = () => {
    setIsConfirmOpen(false);
  };

  const handleRunCode = async () => {
    if (isEmpty(codeRunPro)) {
      setIsOpen(true)
      return
    }

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
      // Lưu response theo questionId
      setResponse(prev => ({
        ...prev,
        [currentQuestion.id]: data
      }))
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
            {templates[idCodeSnippetQuestions] && (
              <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel defaultSize={40}>
                  <div className='h-full w-full overflow-auto bg-[#1b2a32]'>
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
                          initValue={codeSnippets[currentQuestion.id] || templates[idCodeSnippetQuestions]}
                          //sampleFile='resources/com/example/app/Solution.java'
                          containerId={'editor'}
                          onChange={handleEditorChange}
                        />
                      </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle className='h-[3px] resize-sha overflow-hidden bg-slate-300' />
                    <ResizablePanel defaultSize={40}>
                      <div className='h-full w-full overflow-auto'>
                        <TestcaseInterfaceQuiz 
                          response={response[currentQuestion.id]} 
                          loading={loading} 
                          testCase={testCaseMap[idCodeSnippetQuestions]} 
                        />
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
          <div className='space-y-4'>
            <RadioGroup value={selectedAnswer || ''} onValueChange={handleAnswerChange} className='space-y-2'>
              {currentQuestion.questionOptions.map((option) => (
                <div
                  key={option.id}
                  className='flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors'
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className='flex-grow cursor-pointer'>
                    <ReactMarkdown
                      components={{
                        code: CodeBlock
                      }}
                    >
                      {option.content}
                    </ReactMarkdown>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )
      case 'MultipleSelect':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              {currentQuestion.questionOptions.map((option) => (
                <div
                  key={option.id}
                  className='prose flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors'
                >
                  <Checkbox
                    id={option.id}
                    checked={selectedAnswers[option.id] || false}
                    onCheckedChange={(checked) => {
                      handleAnswerChange({ [option.id]: checked }, true)
                    }}
                  />
                  <Label htmlFor={option.id} className='flex-grow cursor-pointer'>
                    <ReactMarkdown
                      components={{
                        code: CodeBlock
                      }}
                    >
                      {option.content}
                    </ReactMarkdown>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return <p>Unsupported question type: {currentQuestion.questionType}</p>
    }
  }

  const handleClose = () => {
    onClose(false);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white w-[90vw] h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col'>
        <Card className='border-0 flex flex-col h-full'>
          <CardHeader className='relative'>
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-4 top-4'
              onClick={handleClose}
              aria-label='Close quiz'
            >
              <X className='h-4 w-4' />
            </Button>
            <div className='flex justify-center items-center mt-2'>
              {hasTimeLimit && (
                <p className='text-lg font-semibold'>
                  Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} minutes
                </p>
              )}
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
                {currentQuestion.questionType !== 'CodeSnippet' && (
                  <div className='prose dark:prose-invert max-w-none mb-4'>
                    <ReactMarkdown
                      components={{
                        code: CodeBlock
                      }}
                    >
                      {currentQuestion.content}
                    </ReactMarkdown>
                  </div>
                )}
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
        onClose={() => setIsOpen(false)}
        message='Are you sure you want to submit your answer?'
      />
      <CustomConfirmModal
        isOpen={isConfirmOpen}
        onComplete={handleCancelSubmit}
        onConfirm={handleSubmitConfirm}
        title='Submit Quiz'
        content='Are you sure you want to submit your answer?'
        confirmText='Yes, I am sure'
        cancelText='No, cancel'
      />
    </div>
  )
}
