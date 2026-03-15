"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mic2, 
  MessageSquareQuote, 
  Zap, 
  TrendingUp, 
  BrainCircuit,
  Trophy,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <MessageSquareQuote className="text-white w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight text-primary">InterviewSense</span>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="font-medium">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="font-bold px-6">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-5xl mx-auto space-y-8">
        <div className="animate-in fade-in zoom-in duration-700">
           <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 mb-6">
             <Sparkles className="w-4 h-4" /> AI-Powered Preparation Platform
           </Badge>
        </div>
        <h1 className="text-6xl md:text-7xl font-headline font-extrabold text-primary leading-tight tracking-tight">
          Master Any Interview with <span className="text-secondary underline decoration-secondary/30">AI Guidance.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          The all-in-one platform for job seekers. Practice voice-based mock interviews, get instant feedback, and solve technical challenges with Gemini AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-10 text-lg font-bold gap-2 rounded-2xl shadow-xl shadow-primary/20">
              Start Free Practice <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl">
            See How It Works
          </Button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 w-full text-left">
          <div className="p-8 rounded-3xl bg-white shadow-xl shadow-primary/5 border border-primary/10 hover:-translate-y-2 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Mic2 className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-headline font-bold text-primary mb-3">Voice AI Assistant</h3>
            <p className="text-muted-foreground leading-relaxed">Speak naturally to our AI. Get complex technical concepts explained or refine your soft skills through natural conversation.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white shadow-xl shadow-secondary/5 border border-secondary/10 hover:-translate-y-2 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
              <Zap className="text-secondary w-6 h-6" />
            </div>
            <h3 className="text-xl font-headline font-bold text-primary mb-3">Real-time Simulation</h3>
            <p className="text-muted-foreground leading-relaxed">Practice with realistic mock interviews across multiple domains including Software, Data, AI, and HR scenarios.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white shadow-xl shadow-primary/5 border border-primary/10 hover:-translate-y-2 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <TrendingUp className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-headline font-bold text-primary mb-3">Skill Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">Receive detailed feedback on clarity, technical accuracy, and confidence. Track your improvement over time.</p>
          </div>
        </div>
      </main>

      {/* Trust Bar */}
      <footer className="bg-primary/5 border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="text-primary w-6 h-6" />
            <span className="font-headline font-bold text-xl text-primary">InterviewSense</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 InterviewSense. Empowering the next generation of professionals.</p>
          <div className="flex gap-6 text-sm text-primary font-medium">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
