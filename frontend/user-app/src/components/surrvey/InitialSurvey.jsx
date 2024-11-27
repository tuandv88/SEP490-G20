import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const InitialSurvey = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    experience: '',
    programmingLanguages: [],
    isCodeEveryday: '',
    preferredLearningMethod: '',
    goal: ''
  });

  const questions = [
    {
      type: 'select',
      question: 'Bạn có bao nhiêu kinh nghiệm lập trình?',
      options: [
        { value: 'beginner', label: 'Mới bắt đầu (< 1 năm)' },
        { value: 'intermediate', label: 'Trung cấp (1-3 năm)' },
        { value: 'advanced', label: 'Nâng cao (3-5 năm)' },
        { value: 'expert', label: 'Chuyên gia (5+ năm)' }
      ],
      key: 'experience'
    },
    {
      type: 'multipleSelect',
      question: 'Những ngôn ngữ lập trình nào bạn đã sử dụng? (Chọn tất cả các lựa chọn phù hợp)',
      options: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'TypeScript', 'PHP'],
      key: 'programmingLanguages'
    },
    {
      type: 'trueFalse',
      question: 'Bạn có code mỗi ngày không?',
      key: 'isCodeEveryday'
    },
    {
      type: 'multipleChoice',
      question: 'Phương pháp học lập trình ưa thích của bạn là gì?',
      options: ['Sách và tài liệu', 'Video tutorials', 'Học tương tác trực tuyến', 'Dự án thực tế', 'Pair programming'],
      key: 'preferredLearningMethod'
    },
    {
      type: 'openEnded',
      question: 'Mục tiêu học lập trình của bạn là gì?',
      key: 'goal'
    }
  ];

  const handleChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    switch (question.type) {
      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={question.key}>{question.question}</Label>
            <Select onValueChange={(value) => handleChange(question.key, value)} value={answers[question.key]}>
              <SelectTrigger id={question.key}>
                <SelectValue placeholder="Chọn mức độ kinh nghiệm" />
              </SelectTrigger>
              <SelectContent>
                {question.options.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'multipleSelect':
        return (
          <div className="space-y-3">
            <Label>{question.question}</Label>
            {question.options.map((option) => (
              <div className="flex items-center space-x-2" key={option}>
                <Checkbox 
                  id={option} 
                  checked={answers[question.key].includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleChange(question.key, [...answers[question.key], option]);
                    } else {
                      handleChange(question.key, answers[question.key].filter(item => item !== option));
                    }
                  }}
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </div>
       );
      case 'trueFalse':
        return (
          <div className="space-y-3">
            <Label>{question.question}</Label>
            <RadioGroup onValueChange={(value) => handleChange(question.key, value)} value={answers[question.key]}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`${question.key}-yes`} />
                <Label htmlFor={`${question.key}-yes`}>Có</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`${question.key}-no`} />
                <Label htmlFor={`${question.key}-no`}>Không</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 'multipleChoice':
        return (
          <div className="space-y-3">
            <Label>{question.question}</Label>
            <RadioGroup onValueChange={(value) => handleChange(question.key, value)} value={answers[question.key]}>
              {question.options.map((option) => (
                <div className="flex items-center space-x-2" key={option}>
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 'openEnded':
        return (
          <div className="space-y-2">
            <Label htmlFor={question.key}>{question.question}</Label>
            <Textarea
              id={question.key}
              value={answers[question.key]}
              onChange={(e) => handleChange(question.key, e.target.value)}
              placeholder="Nhập câu trả lời của bạn ở đây..."
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderQuestion()}
      <div className="flex justify-between">
        <Button onClick={handlePrevious} disabled={currentQuestion === 0}>Quay lại</Button>
        <Button onClick={handleNext}>
          {currentQuestion === questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
        </Button>
      </div>
    </div>
  );
};

export default InitialSurvey;

