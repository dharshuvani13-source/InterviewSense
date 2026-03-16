
"use client"

import React, { useState, useEffect, useRef } from 'react'
import { 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  Star, 
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { generateMockInterviewQuestion, type GenerateMockInterviewQuestionOutput } from '@/ai/flows/generate-mock-interview-question-flow'
import { aiInterviewAnswerFeedback, type InterviewAnswerFeedbackOutput } from '@/ai/flows/ai-interview-answer-feedback'
import { questionTTS } from '@/ai/flows/question-tts-flow'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { cn } from '@/lib/utils'
import { useUser, useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'

type InterviewState = 'idle' | 'questioning' | 'answering' | 'evaluating' | 'finished'

const DOMAINS = [
  { id: 'Data Scientist', desc: 'Analysis & ML Models' },
  { id: 'DevOps Engineer', desc: 'CI/CD & Monitoring' },
  { id: 'Mobile App Developer', desc: 'Android / iOS' },
  { id: 'Frontend Developer', desc: 'UI & Performance' },
  { id: 'Backend Developer', desc: 'APIs & Architecture' },
  { id: 'QA / Test Engineer', desc: 'Automation & Testing' },
  { id: 'UI/UX Designer', desc: 'Design & Experience' },
  { id: 'Data Engineer', desc: 'Pipelines & Big Data' },
  { id: 'Machine Learning Engineer', desc: 'Deployment & MLOps' },
  { id: 'Blockchain Developer', desc: 'Smart Contracts & Web3' },
  { id: 'Game Developer', desc: 'Engines & Graphics' },
  { id: 'Embedded Systems Engineer', desc: 'IoT & Hardware' }
]

export function MockInterviewSession() {
  const { user } = useUser()
  const db = useFirestore()
  const [state, setState] = useState<InterviewState>('idle')
  const [selectedDomain, setSelectedDomain] = useState('Frontend Developer')
  const [currentQuestion, setCurrentQuestion] = useState<GenerateMockInterviewQuestionOutput | null>(null)
  const [feedback, setFeedback] = useState<InterviewAnswerFeedbackOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [codeAnswer, setCodeAnswer] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
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
    if (!user) return;
    setIsLoading(true)
    try {
      // Create a session in Firestore
      const sessionRef = collection(db, 'userProfiles', user.uid, 'interviewSessions');
      const newSession = {
        userId: user.uid,
        domain: selectedDomain,
        status: 'started',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDocumentNonBlocking(sessionRef, newSession);
      if (docRef) setSessionId(docRef.id);

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
    if (!user || !sessionId || !currentQuestion) return;
    
    stopListening()
    setIsLoading(true)
    setState('evaluating')
    
    try {
      const result = await aiInterviewAnswerFeedback({
        domain: selectedDomain,
        question: currentQuestion.question,
        userAnswer: spokenTranscript || transcript,
        codeSnippet: currentQuestion.type === 'solving' ? codeAnswer : undefined
      })
      
      setFeedback(result)
      setQuestionsAnswered(prev => prev + 1)

      // Save question and answer to Firestore
      const questionRef = collection(db, 'userProfiles', user.uid, 'interviewSessions', sessionId, 'interviewQuestions');
      const qData = {
        userId: user.uid,
        interviewSessionId: sessionId,
        questionText: currentQuestion.question,
        questionType: currentQuestion.type,
        sequenceNumber: questionsAnswered + 1,
        createdAt: new Date().toISOString(),
      };
      const newQRef = await addDocumentNonBlocking(questionRef, qData);

      if (newQRef) {
        const answerRef = doc(db, 'userProfiles', user.uid, 'interviewSessions', sessionId, 'interviewQuestions', newQRef.id, 'answer', 'answer');
        const aData = {
          userId: user.uid,
          interviewSessionId: sessionId,
          interviewQuestionId: newQRef.id,
          answerText: spokenTranscript || transcript,
          codeSnippet: codeAnswer,
          clarityFeedback: result.clarityFeedback,
          confidenceFeedback: result.confidenceAssessment,
          technicalAccuracyFeedback: result.technicalAccuracyFeedback,
          improvementSuggestions: result.improvementSuggestions.join(', '),
          score: result.overallScore,
          knowledgeCreditsEarned: result.overallScore * 10,
          evaluatedAt: new Date().toISOString(),
        };
        setDoc(answerRef, aData);

        // Update user profile credits
        const profileRef = doc(db, 'userProfiles', user.uid);
        // We assume UserProfile exists since auth is active, but we should be safe
        setDoc(profileRef, { 
          knowledgeCredits: (questionsAnswered === 0 ? 0 : 0) + (result.overallScore * 10),
          updatedAt: new Date().toISOString()
        }, { merge: true });
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
      <Card className="glass-card max-w-4xl mx-auto overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Mock Interview Mentor</CardTitle>
          <CardDescription className="text-lg">Select a modern technical domain to begin your moderate-strict simulation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DOMAINS.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all hover:shadow-md",
                    selectedDomain === domain.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-muted hover:border-primary/50"
                  )}
                >
                  <div className="font-semibold text-primary text-sm">{domain.id}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{domain.desc}</div>
                </button>
              ))}
            </div>
          </ScrollArea>
          
          <div className="bg-secondary/10 p-4 rounded-xl flex gap-3 items-center border border-secondary/20">
            <Zap className="text-secondary h-8 w-8 shrink-0" />
            <div className="text-sm">
              <span className="font-bold block text-secondary">Balanced Evaluation Strategy</span>
              Strict 50/50 mix of voice (conceptual) and board (solving) challenges. 
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startInterview} disabled={isLoading} className="w-full h-12 text-lg gap-2 shadow-xl shadow-primary/20">
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
            Initiate Session: {selectedDomain}
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
          <span className="text-muted-foreground text-sm font-medium">Challenge {questionsAnswered + 1}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setState('idle')} className="text-muted-foreground hover:text-primary">
            <RotateCcw className="h-4 w-4 mr-2" /> Exit
          </Button>
        </div>
      </div>

      <Card className="shadow-2xl border-none overflow-hidden">
        <div className={cn("h-1", currentQuestion?.type === 'solving' ? "bg-secondary" : "bg-primary")} />
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge className={cn("text-white mb-2", currentQuestion?.type === 'solving' ? "bg-secondary" : "bg-primary")}>
               {currentQuestion?.difficulty || 'Medium'}
            </Badge>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => speakQuestion(currentQuestion?.question || '')} className="rounded-lg">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">{currentQuestion?.skillAssessed}</Badge>
            </div>
          </div>
          <CardTitle className="text-2xl font-headline leading-snug">
            {currentQuestion?.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {state === 'questioning' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className={cn(
                "w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner",
                currentQuestion?.type === 'solving' ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
              )}>
                {currentQuestion?.type === 'solving' ? <Code2 className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
              </div>
              <p className="text-muted-foreground max-w-sm font-medium">
                {currentQuestion?.type === 'solving' 
                  ? "Analyze the problem. Enter your solution or logic on the terminal board."
                  : "Speak naturally. Mentor evaluates after 2s of silence."}
              </p>
              <Button onClick={startAnswer} size="lg" className="rounded-2xl px-12 h-14 text-lg font-bold shadow-lg">
                {currentQuestion?.type === 'solving' ? "Open Solving Board" : "Begin Spoken Answer"}
              </Button>
            </div>
          )}

          {state === 'answering' && (
            <div className="space-y-4">
              {currentQuestion?.type === 'conceptual' ? (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-8 min-h-[200px] relative transition-all">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                     <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                     <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Mentor Listening</span>
                  </div>
                  <p className="text-2xl text-primary font-medium italic leading-relaxed">
                    {transcript || "Speak now..."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                     <Terminal className="h-4 w-4" /> Environment: workspace.ts
                   </div>
                   <div className="rounded-2xl border bg-zinc-950 p-1 shadow-2xl overflow-hidden">
                      <div className="bg-zinc-900 px-4 py-2 flex justify-between items-center border-b border-zinc-800">
                         <div className="flex gap-1.5">
                           <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                           <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                         </div>
                         <Badge variant="outline" className="text-[9px] text-zinc-500 border-zinc-800 font-mono">SANDBOX_VM_04</Badge>
                      </div>
                      <Textarea 
                        value={codeAnswer}
                        onChange={(e) => setCodeAnswer(e.target.value)}
                        placeholder="// Enter code, algorithms, or numeric reasoning here..."
                        className="min-h-[350px] bg-zinc-950 text-emerald-400 font-mono text-sm border-none focus-visible:ring-0 resize-none rounded-b-lg p-6"
                      />
                   </div>
                </div>
              )}
              <div className="flex justify-center pt-4">
                <Button onClick={() => submitAnswer()} size="lg" className="rounded-2xl bg-primary hover:bg-primary/90 px-16 h-16 text-xl font-bold gap-3 shadow-2xl shadow-primary/30">
                  <CheckCircle2 className="h-6 w-6" /> Submit for Evaluation
                </Button>
              </div>
            </div>
          )}

          {(state === 'evaluating' || state === 'finished') && (
            <div className="space-y-6 animate-in fade-in duration-700">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center gap-6">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <p className="font-headline font-bold text-2xl text-primary">Mentor is analyzing your performance...</p>
                </div>
              ) : feedback && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-primary/5 border-primary/20 shadow-none">
                       <CardContent className="pt-8 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-primary mb-2 uppercase tracking-widest">Mentor Score</span>
                          <div className="text-5xl font-headline font-bold text-primary">{feedback.overallScore}/10</div>
                       </CardContent>
                    </Card>
                    <Card className="bg-secondary/5 border-secondary/20 shadow-none">
                       <CardContent className="pt-8 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-secondary mb-2 uppercase tracking-widest">Delivery Context</span>
                          <div className="text-xs font-bold text-secondary text-center leading-relaxed mt-1">{feedback.confidenceAssessment}</div>
                       </CardContent>
                    </Card>
                    <Card className="bg-muted shadow-none">
                       <CardContent className="pt-8 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Expert Rating</span>
                          <div className="flex items-center gap-1 mt-1">
                             {[1,2,3,4,5].map(s => (
                               <Star key={s} className={cn("h-5 w-5 fill-current", s <= Math.round(feedback.overallScore / 2) ? "text-yellow-500" : "text-muted-foreground/20")} />
                             ))}
                          </div>
                       </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <h4 className="flex items-center gap-2 font-bold text-primary uppercase text-sm tracking-widest">
                          <Info className="h-5 w-5" /> Professional Analysis
                       </h4>
                       <div className="p-6 bg-white border-2 border-primary/5 rounded-2xl text-sm space-y-6 shadow-xl">
                          <div>
                            <span className="font-bold text-[10px] uppercase text-muted-foreground block mb-2 tracking-tighter">Communication & Clarity</span>
                            <p className="text-foreground leading-relaxed">{feedback.clarityFeedback}</p>
                          </div>
                          <div>
                            <span className="font-bold text-[10px] uppercase text-muted-foreground block mb-2 tracking-tighter">Technical Precision</span>
                            <p className="text-foreground leading-relaxed">{feedback.technicalAccuracyFeedback}</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <h4 className="flex items-center gap-2 font-bold text-secondary uppercase text-sm tracking-widest">
                          <Lightbulb className="h-5 w-5" /> Mentor's Key Advice
                       </h4>
                       <ul className="space-y-3">
                          {feedback.improvementSuggestions.map((s, i) => (
                            <li key={i} className="text-sm flex gap-4 p-5 bg-secondary/5 rounded-2xl border border-secondary/10 shadow-lg group hover:bg-secondary/10 transition-colors">
                              <div className="h-6 w-6 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5 text-secondary font-bold text-xs">{i+1}</div>
                              <span className="text-foreground font-medium leading-relaxed">{s}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                  </div>

                  <div className="pt-10 flex justify-center gap-6">
                    <Button variant="outline" onClick={() => setState('idle')} className="rounded-2xl px-12 h-14 font-bold">Exit Simulation</Button>
                    <Button onClick={handleNextQuestion} className="gap-3 bg-primary rounded-2xl px-12 h-14 font-bold shadow-2xl shadow-primary/20">
                       Next Challenge <ChevronRight className="h-5 w-5" />
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
