"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { voiceAssistantQuery, type VoiceAssistantQueryOutput } from '@/ai/flows/voice-assistant-query'
import { cn } from '@/lib/utils'

export function VoiceInteraction() {
  const { isListening, transcript, startListening, stopListening, supported } = useSpeechRecognition()
  const [query, setQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState<VoiceAssistantQueryOutput | null>(null)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (transcript) {
      setQuery(transcript)
    }
  }, [transcript])

  const handleProcessQuery = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim() || isProcessing) return

    setIsProcessing(true)
    stopListening()
    
    try {
      const result = await voiceAssistantQuery({ question: query })
      setResponse(result)
      
      if (autoSpeak && result.audio) {
        if (audioRef.current) {
          audioRef.current.src = result.audio
          audioRef.current.play()
        }
      }
    } catch (error) {
      console.error("AI Query Error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
      handleProcessQuery()
    } else {
      startListening()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass-card overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-headline flex items-center gap-2">
            <Mic2 className="text-primary h-5 w-5" /> Voice AI Assistant
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={cn(autoSpeak ? "text-primary" : "text-muted-foreground")}
            >
              {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
              <Sparkles className="w-3 h-3 mr-1" /> Multi-Domain Knowledge
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="min-h-[120px] p-4 bg-background/50 rounded-xl border border-dashed flex items-center justify-center text-center relative group">
            {isListening ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center voice-ripple">
                  <Mic className="text-secondary w-6 h-6" />
                </div>
                <p className="text-sm font-medium animate-pulse text-secondary">Listening for your question...</p>
                <p className="text-lg text-primary max-w-md italic">{query || 'Speak now...'}</p>
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Analyzing query with Gemini AI...</p>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <p className="text-lg">"What are the key SOLID principles?"</p>
                <p className="text-sm mt-1 opacity-70">Ask me anything about tech, HR, or career tips.</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type or use voice command..."
              className="flex-1 bg-white rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleProcessQuery()}
            />
            <Button 
              size="icon" 
              variant={isListening ? "destructive" : "secondary"}
              onClick={toggleListening}
              className="rounded-lg h-10 w-10 shrink-0 shadow-sm"
              disabled={!supported || isProcessing}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button 
              onClick={() => handleProcessQuery()}
              disabled={isProcessing || !query.trim()}
              className="rounded-lg px-6 gap-2"
            >
              <Send className="h-4 w-4" /> Ask AI
            </Button>
          </div>
        </CardContent>
      </Card>

      {response && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
            <CardHeader>
              <CardTitle className="text-2xl text-primary font-headline">{response.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" /> Detailed Explanation
                </h4>
                <p className="text-foreground leading-relaxed text-lg">{response.explanation}</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-xl border">
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Example / Sample Answer</h4>
                <div className="prose max-w-none text-primary/80 italic whitespace-pre-wrap">
                  {response.example}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-secondary" /> Expert Tips
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {response.keyTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm p-3 bg-white rounded-lg border shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-secondary">{idx + 1}</span>
                      </div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}

function Mic2(props: any) {
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
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}
