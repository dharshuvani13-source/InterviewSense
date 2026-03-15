"use client"

import React, { useState, useEffect } from 'react'
import { 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  Star, 
  Award,
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  Lightbulb,
  Mic
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { generateMockInterviewQuestion, type GenerateMockInterviewQuestionOutput } from '@/ai/flows/generate-mock-interview-question-flow'
import { aiInterviewAnswerFeedback, type InterviewAnswerFeedbackOutput } from '@/ai/flows/ai-interview-answer-feedback'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { cn } from '@/lib/utils'

type InterviewState = 'idle' | 'questioning' | 'answering' | 'evaluating' | 'finished'

const DOMAINS = ['Software Developer', 'HR Interview', 'Data Analyst', 'AI Engineer', 'System Design']

export function MockInterviewSession() {
  const [state, setState] = useState<InterviewState>('idle')
  const [selectedDomain, setSelectedDomain] = useState('Software Developer')
  const [currentQuestion, setCurrentQuestion] = useState<GenerateMockInterviewQuestionOutput | null>(null)
  const [feedback, setFeedback] = useState<InterviewAnswerFeedbackOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition()

  const startInterview = async () => {
    setIsLoading(true)
    try {
      const q = await generateMockInterviewQuestion({ domain: selectedDomain })
      setCurrentQuestion(q)
      setState('questioning')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextQuestion = async () => {
    setIsLoading(true)
    setFeedback(null)
    try {
      const q = await generateMockInterviewQuestion({ domain: selectedDomain })
      setCurrentQuestion(q)
      setState('questioning')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const startAnswer = () => {
    startListening()
    setState('answering')
  }

  const submitAnswer = async () => {
    stopListening()
    setIsLoading(true)
    setState('evaluating')
    try {
      if (currentQuestion && transcript) {
        const result = await aiInterviewAnswerFeedback({
          domain: selectedDomain,
          question: currentQuestion.question,
          userAnswer: transcript
        })
        setFeedback(result)
        setQuestionsAnswered(prev => prev + 1)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (state === 'idle') {
    return (
      <Card className="glass-card max-w-2xl mx-auto overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Mock Interview Simulator</CardTitle>
          <CardDescription className="text-lg">Select a domain to start practicing with AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOMAINS.map(domain => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all hover:shadow-md",
                  selectedDomain === domain ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-muted hover:border-primary/50"
                )}
              >
                <div className="font-semibold text-primary">{domain}</div>
                <div className="text-xs text-muted-foreground mt-1">Practice specific scenarios</div>
              </button>
            ))}
          </div>
          
          <div className="bg-secondary/10 p-4 rounded-xl flex gap-3 items-center border border-secondary/20">
            <Award className="text-secondary h-8 w-8 shrink-0" />
            <div className="text-sm">
              <span className="font-bold block text-secondary">Earn Knowledge Credits</span>
              Complete interviews to build your profile and track progress.
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startInterview} disabled={isLoading} className="w-full h-12 text-lg gap-2">
            {isLoading ? <Loader2 className="animate-spin" /> : <Play className="h-5 w-5 fill-current" />}
            Start Interview Session
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary">{selectedDomain}</Badge>
          <span className="text-muted-foreground text-sm">Question {questionsAnswered + 1}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setState('idle')} className="text-muted-foreground">
            <RotateCcw className="h-4 w-4 mr-2" /> Reset Session
          </Button>
        </div>
      </div>

      <Card className="shadow-xl border-none">
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge className="bg-secondary text-white mb-2">{currentQuestion?.difficulty || 'Medium'}</Badge>
            <Badge variant="outline" className="text-xs">{currentQuestion?.skillAssessed}</Badge>
          </div>
          <CardTitle className="text-2xl font-headline leading-tight">
            {currentQuestion?.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {state === 'questioning' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Mic className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground max-w-sm">Ready to answer? We'll record your voice and evaluate your response.</p>
              <Button onClick={startAnswer} size="lg" className="rounded-full px-8">Start Your Answer</Button>
            </div>
          )}

          {state === 'answering' && (
            <div className="space-y-4">
              <div className="bg-secondary/5 border-2 border-secondary/20 rounded-2xl p-6 min-h-[150px] relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                   <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                   <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Recording</span>
                </div>
                <p className="text-xl text-primary font-medium italic">
                  {transcript || "Listening to your response..."}
                </p>
              </div>
              <div className="flex justify-center">
                <Button onClick={submitAnswer} size="lg" className="rounded-full bg-secondary hover:bg-secondary/90 px-12 h-14 text-lg">
                  Submit for Evaluation
                </Button>
              </div>
            </div>
          )}

          {(state === 'evaluating' || state === 'finished') && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="font-medium">AI is evaluating your response...</p>
                </div>
              ) : feedback && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex flex-col items-center justify-center">
                       <span className="text-sm font-bold text-primary mb-1 uppercase tracking-tighter">Overall Score</span>
                       <div className="text-4xl font-headline text-primary">{feedback.overallScore}/10</div>
                    </div>
                    <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/20 flex flex-col items-center justify-center">
                       <span className="text-sm font-bold text-secondary mb-1 uppercase tracking-tighter">Confidence</span>
                       <div className="text-lg font-medium text-secondary text-center leading-tight">{feedback.confidenceAssessment}</div>
                    </div>
                    <div className="bg-muted p-4 rounded-xl border flex flex-col items-center justify-center">
                       <span className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-tighter">Domain Accuracy</span>
                       <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={cn("h-4 w-4 fill-current", s <= Math.round(feedback.overallScore / 2) ? "text-yellow-500" : "text-muted-foreground/30")} />
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <h4 className="flex items-center gap-2 font-bold text-primary">
                          <CheckCircle2 className="h-5 w-5" /> Clarity & Accuracy
                       </h4>
                       <div className="p-4 bg-background border rounded-lg text-sm space-y-3">
                          <p><strong>Clarity:</strong> {feedback.clarityFeedback}</p>
                          <p><strong>Technical:</strong> {feedback.technicalAccuracyFeedback}</p>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <h4 className="flex items-center gap-2 font-bold text-secondary">
                          <Lightbulb className="h-5 w-5" /> Improvement Tips
                       </h4>
                       <ul className="space-y-2">
                          {feedback.improvementSuggestions.map((s, i) => (
                            <li key={i} className="text-sm flex gap-2 p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                              <ChevronRight className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                              {s}
                            </li>
                          ))}
                       </ul>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setState('idle')}>Finish Session</Button>
                    <Button onClick={handleNextQuestion} className="gap-2">
                       Next Question <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
