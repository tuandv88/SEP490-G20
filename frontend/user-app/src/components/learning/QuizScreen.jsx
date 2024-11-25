import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, RefreshCcw } from "lucide-react";
import { ArrowRight } from "lucide-react";
import ReactMarkdown from 'react-markdown'

const QuizScreen = ({ quizData }) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Main Content */}
          <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="bg-primary py-12 text-center rounded-t-lg">
                <h1 className="text-4xl font-bold text-primary-foreground mb-4">Title 1</h1>
              </CardHeader>
              <CardContent className="p-8 text-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full"
                  onClick={() => console.log('Start Quiz')}
                >
                  Start Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <QuizSidebar1 />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, className = "" }) => (
    <div className={`text-center p-4 rounded-lg bg-secondary/20 ${className}`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );


const QuizSidebar1 = () => {
    return (
      <div className="lg:w-96 p-6 lg:border-l border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Time and Attempts */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary rounded-lg">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Time Limit</p>
                    <p className="text-lg font-semibold">30</p>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary rounded-lg">
                    <RefreshCcw className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Attempts Left</p>
                    <p className="text-lg font-semibold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
  
          <Separator />
  
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Score" value={1} />
                <StatCard label="Questions" value={1} />
                <StatCard 
                  label="Correct" 
                  value={1}
                  className="bg-green-100 dark:bg-green-900/20" 
                />
                <StatCard 
                  label="Wrong" 
                  value={1}
                  className="bg-red-100 dark:bg-red-900/20" 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
};

export default QuizScreen;