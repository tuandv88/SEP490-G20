import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const JavaSurvey = ({ onComplete }) => {
  const [answers, setAnswers] = useState({
    oop: '',
    frameworks: '',
    projects: ''
  });

  const handleChange = (name, value) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Java Survey Answers:', answers);
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="oop">Bạn đánh giá thế nào về hiểu biết của mình về OOP trong Java?</Label>
        <Select onValueChange={(value) => handleChange('oop', value)}>
          <SelectTrigger id="oop">
            <SelectValue placeholder="Chọn mức độ hiểu biết" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Cơ bản</SelectItem>
            <SelectItem value="intermediate">Trung bình</SelectItem>
            <SelectItem value="advanced">Nâng cao</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="frameworks">Bạn đã sử dụng những framework Java nào?</Label>
        <Input
          id="frameworks"
          value={answers.frameworks}
          onChange={(e) => handleChange('frameworks', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="projects">Bạn đã làm những dự án gì với Java?</Label>
        <Textarea
          id="projects"
          value={answers.projects}
          onChange={(e) => handleChange('projects', e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">Hoàn thành</Button>
    </form>
  );
};

export default JavaSurvey;

