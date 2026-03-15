"use client"

import React, { useState, useEffect, useRef } from 'react'
import { 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  Star, 
  Award,
  TrendingUp,
  BrainCircuit,
  Lightbulb,
  Mic,
  Code2,
  Volume2,
  Terminal,
  Loader2,
  Zap,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { generateMockInterviewQuestion, type GenerateMockInterviewQuestionOutput } from '@/ai/flows/generate-mock-interview-question-flow'
import { aiInterviewAnswerFeedback, type InterviewAnswerFeedbackOutput } from '@/ai/flows/ai-interview-answer-feedback'
import { questionTTS } from '@/ai/flows/question-tts-flow'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { cn } from '@/lib/utils'

type InterviewState = 'idle' | 'questioning' | 'answering' | 'evaluating' | 'finished'

const DOMAINS = [
  'Full Stack Developer', 
  'AI Engineer', 
  'Cloud Architect', 
  'Cybersecurity', 
  'Product Manager',
  'System Design'
]

export function MockInterviewSession() {
  const [state, setState] = useState<InterviewState>('idle')
  const [selectedDomain, setSelectedDomain] = useState('Full Stack Developer')
  const [currentQuestion, setCurrentQuestion] = useState<GenerateMockInterviewQuestionOutput | null>(null)
  const [feedback, setFeedback] = useState<InterviewAnswerFeedbackOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [codeAnswer, setCodeAnswer] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition()
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const speakQuestion = async (text: string) => {
    try {
      const audioData = await questionTTS(text)
      if (audioRef.current) {
        audioRef.current.src = audioData
        audioRef.current.play()
      }
    } catch (e) {
      console.error("TTS failed", e)
    }
  }

  const startInterview = async () => {
    setIsLoading(true)
    try {
      const q = await generateMockInterviewQuestion({ domain: selectedDomain })
      setCurrentQuestion(q)
      setCodeAnswer(q.initialCode || '')
      setState('questioning')
      await speakQuestion(q.question)
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
      setCodeAnswer(q.initialCode || '')
      setState('questioning')
      await speakQuestion(q.question)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const startAnswer = () => {
    if (currentQuestion?.type === 'conceptual') {
      startListening()
    }
    setState('answering')
  }

  const submitAnswer = async (spokenTranscript?: string) => {
    stopListening()
    setIsLoading(true)
    setState('evaluating')
    try {
      if (currentQuestion) {
        const result = await aiInterviewAnswerFeedback({
          domain: selectedDomain,
          question: currentQuestion.question,
          userAnswer: spokenTranscript || transcript,
          codeSnippet: currentQuestion.type === 'solving' ? codeAnswer : undefined
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

  useEffect(() => {
    if (state === 'answering' && currentQuestion?.type === 'conceptual' && transcript) {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = setTimeout(() => {
        submitAnswer(transcript)
      }, 2000)
    }
    return () => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)
    }
  }, [transcript, state, currentQuestion])

  if (state === 'idle') {
    return (
      <Card className="glass-card max-w-2xl mx-auto overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Mock Interview Mentor</CardTitle>
          <CardDescription className="text-lg">Experience a moderate but firm simulation with real-world domains.</CardDescription>
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
                <div className="text-xs text-muted-foreground mt-1">Realistic scenarios</div>
              </button>
            ))}
          </div>
          
          <div className="bg-secondary/10 p-4 rounded-xl flex gap-3 items-center border border-secondary/20">
            <Zap className="text-secondary h-8 w-8 shrink-0" />
            <div className="text-sm">
              <span className="font-bold block text-secondary">Balanced Evaluation</span>
              A 50/50 mix of voice (conceptual) and board (solving) challenges.
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startInterview} disabled={isLoading} className="w-full h-12 text-lg gap-2">
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
            Start Mock Interview
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <audio ref={audioRef} className="hidden" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary">{selectedDomain}</Badge>
          <Badge variant="secondary" className="capitalize">{currentQuestion?.type} mode</Badge>
          <span className="text-muted-foreground text-sm">Question {questionsAnswered + 1}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setState('idle')} className="text-muted-foreground">
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      <Card className="shadow-xl border-none overflow-hidden">
        <div className={cn("h-1", currentQuestion?.type === 'solving' ? "bg-secondary" : "bg-primary")} />
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge className={cn("text-white mb-2", currentQuestion?.type === 'solving' ? "bg-secondary" : "bg-primary")}>
               {currentQuestion?.difficulty || 'Medium'}
            </Badge>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => speakQuestion(currentQuestion?.question || '')}>
                <Volume2 className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="text-xs">{currentQuestion?.skillAssessed}</Badge>
            </div>
          </div>
          <CardTitle className="text-2xl font-headline leading-tight">
            {currentQuestion?.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {state === 'questioning' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                currentQuestion?.type === 'solving' ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
              )}>
                {currentQuestion?.type === 'solving' ? <Code2 className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </div>
              <p className="text-muted-foreground max-w-sm">
                {currentQuestion?.type === 'solving' 
                  ? "Analyze the problem and provide your solution on the board."
                  : "Speak your answer clearly. Evaluated after 2s of silence."}
              </p>
              <Button onClick={startAnswer} size="lg" className="rounded-full px-8">
                {currentQuestion?.type === 'solving' ? "Enter Solving Board" : "Start Voice Answer"}
              </Button>
            </div>
          )}

          {state === 'answering' && (
            <div className="space-y-4">
              {currentQuestion?.type === 'conceptual' ? (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 min-h-[150px] relative">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                     <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                     <span className="text-xs font-bold text-red-500 uppercase tracking-widest text-primary/70">Mentor Listening</span>
                  </div>
                  <p className="text-xl text-primary font-medium italic">
                    {transcript || "Listening..."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                     <Terminal className="h-4 w-4" /> Technical Solution Board
                   </div>
                   <div className="rounded-xl border bg-zinc-950 p-1">
                      <div className="bg-zinc-900 rounded-t-lg px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                         <span className="text-xs font-mono text-zinc-400">workspace.ts</span>
                         <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-700">Sandbox</Badge>
                      </div>
                      <Textarea 
                        value={codeAnswer}
                        onChange={(e) => setCodeAnswer(e.target.value)}
                        placeholder="// Enter your code or reasoning here..."
                        className="min-h-[300px] bg-zinc-950 text-emerald-400 font-mono text-sm border-none focus-visible:ring-0 resize-none rounded-b-lg"
                      />
                   </div>
                </div>
              )}
              <div className="flex justify-center">
                <Button onClick={() => submitAnswer()} size="lg" className="rounded-full bg-primary hover:bg-primary/90 px-12 h-14 text-lg gap-2 shadow-lg shadow-primary/20">
                  <CheckCircle2 className="h-5 w-5" /> Submit to Mentor
                </Button>
              </div>
            </div>
          )}

          {(state === 'evaluating' || state === 'finished') && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="font-medium text-lg text-primary">The mentor is reviewing your response...</p>
                </div>
              ) : feedback && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-primary/5 border-primary/20">
                       <CardContent className="pt-6 flex flex-col items-center">
                          <span className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Mentor Score</span>
                          <div className="text-4xl font-headline font-bold text-primary">{feedback.overallScore}/10</div>
                       </CardContent>
                    </Card>
                    <Card className="bg-secondary/5 border-secondary/20">
                       <CardContent className="pt-6 flex flex-col items-center">
                          <span className="text-xs font-bold text-secondary mb-1 uppercase tracking-widest">Confidence</span>
                          <div className="text-sm font-medium text-secondary text-center leading-tight mt-1">{feedback.confidenceAssessment}</div>
                       </CardContent>
                    </Card>
                    <Card className="bg-muted">
                       <CardContent className="pt-6 flex flex-col items-center">
                          <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest">Proficiency</span>
                          <div className="flex items-center gap-1 mt-1">
                             {[1,2,3,4,5].map(s => (
                               <Star key={s} className={cn("h-4 w-4 fill-current", s <= Math.round(feedback.overallScore / 2) ? "text-yellow-500" : "text-muted-foreground/30")} />
                             ))}
                          </div>
                       </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <h4 className="flex items-center gap-2 font-bold text-primary">
                          <Info className="h-5 w-5" /> Analysis
                       </h4>
                       <div className="p-5 bg-white border rounded-xl text-sm space-y-4 shadow-sm">
                          <div>
                            <span className="font-bold text-xs uppercase text-muted-foreground block mb-1">Communication Clarity</span>
                            <p className="text-foreground">{feedback.clarityFeedback}</p>
                          </div>
                          <div>
                            <span className="font-bold text-xs uppercase text-muted-foreground block mb-1">Technical Rigor</span>
                            <p className="text-foreground">{feedback.technicalAccuracyFeedback}</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <h4 className="flex items-center gap-2 font-bold text-secondary">
                          <Lightbulb className="h-5 w-5" /> Mentor's Guidance
                       </h4>
                       <ul className="space-y-2">
                          {feedback.improvementSuggestions.map((s, i) => (
                            <li key={i} className="text-sm flex gap-3 p-4 bg-secondary/5 rounded-xl border border-secondary/10 shadow-sm">
                              <ChevronRight className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                              <span className="text-foreground leading-relaxed">{s}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setState('idle')} className="rounded-xl px-8">Exit Session</Button>
                    <Button onClick={handleNextQuestion} className="gap-2 bg-primary rounded-xl px-8 shadow-lg shadow-primary/20">
                       Next Challenge <ChevronRight className="h-4 w-4" />
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
