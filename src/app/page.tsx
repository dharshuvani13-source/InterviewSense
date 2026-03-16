
"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Mic2, 
  MessageSquareQuote, 
  Zap, 
  TrendingUp, 
  BrainCircuit,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Mail,
  MapPin,
  Phone
} from 'lucide-react'
import { useUser } from '@/firebase'

export default function LandingPage() {
  const { user } = useUser()

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <MessageSquareQuote className="text-white w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight text-primary">InterviewSense</span>
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <Link href="/dashboard">
              <Button className="font-bold px-6">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" className="font-medium">Sign In</Button>
              </Link>
              <Link href="/auth">
                <Button className="font-bold px-6 shadow-lg shadow-primary/20">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-5xl mx-auto space-y-8">
          <div className="animate-in fade-in zoom-in duration-700">
             <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 mb-6">
               <Sparkles className="w-4 h-4" /> AI-Powered Preparation Platform
             </Badge>
          </div>
          <h1 className="text-6xl md:text-7xl font-headline font-extrabold text-primary leading-tight tracking-tight">
            Master Any Interview with <span className="text-secondary underline decoration-secondary/30">AI Guidance.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Practice voice-based mock interviews, get instant technical feedback, and solve complex coding challenges with Gemini AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="h-14 px-10 text-lg font-bold gap-2 rounded-2xl shadow-xl shadow-primary/20">
                Start Free Practice <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl" onClick={scrollToFeatures}>
              See How It Works
            </Button>
          </div>
        </section>

        {/* Visual Features Section */}
        <section id="features" className="py-24 bg-primary/[0.02] border-y">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6">
                Engineered for Professional Excellence
              </h2>
              <p className="text-lg text-muted-foreground">
                We've combined advanced Speech-to-Text with Gemini's reasoning to create a realistic simulation that pushes your boundaries.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {/* Feature 1: Solving Board */}
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-full aspect-square relative group">
                  <div className="absolute inset-0 bg-secondary/10 rounded-3xl -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-white shadow-2xl rounded-3xl p-6 border flex flex-col space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                       <div className="flex gap-1">
                         <div className="w-2 h-2 rounded-full bg-red-400" />
                         <div className="w-2 h-2 rounded-full bg-yellow-400" />
                         <div className="w-2 h-2 rounded-full bg-green-400" />
                       </div>
                       <Badge variant="outline" className="text-[10px] scale-75 font-mono">workspace.ts</Badge>
                    </div>
                    <div className="flex-1 font-mono text-left text-[11px] text-primary/70 space-y-1">
                      <p><span className="text-blue-500">function</span> <span className="text-emerald-500">solveChallenge</span>() {'{'}</p>
                      <p className="pl-4"><span className="text-purple-500">const</span> result = <span className="text-orange-500">"Hired"</span>;</p>
                      <p className="pl-4"><span className="text-blue-500">return</span> result;</p>
                      <p>{'}'}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3 flex items-center justify-between border border-emerald-100">
                       <span className="text-emerald-700 font-bold text-xs">8.5 Match</span>
                       <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold text-primary mb-3">Interactive Solving Board</h3>
                  <p className="text-muted-foreground">Practice technical and coding challenges with an integrated board that evaluates your logic and precision.</p>
                </div>
              </div>

              {/* Feature 2: Voice Assistant */}
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-full aspect-square relative group">
                  <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-3 group-hover:rotate-0 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-white shadow-2xl rounded-3xl p-8 border flex flex-col justify-center space-y-6">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center relative">
                        <Mic2 className="w-8 h-8 text-primary" />
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                      </div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Listening...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-3/4 bg-muted rounded-full mx-auto" />
                      <div className="h-3 w-1/2 bg-muted rounded-full mx-auto" />
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 italic text-sm text-primary">
                      "Explain the virtual DOM..."
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold text-primary mb-3">AI Voice Assistant</h3>
                  <p className="text-muted-foreground">Natural language interaction for career advice, technical explanations, and quick soft-skill sessions.</p>
                </div>
              </div>

              {/* Feature 3: Mentor Feedback */}
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-full aspect-square relative group">
                  <div className="absolute inset-0 bg-secondary/10 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-white shadow-2xl rounded-3xl p-6 border flex flex-col space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">M</div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-primary">AI Mentor</p>
                        <p className="text-[10px] text-muted-foreground">Firm-Moderate Mode</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-end">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase">Score</span>
                         <span className="text-2xl font-bold text-primary">8.2/10</span>
                       </div>
                       <div className="h-2 bg-muted rounded-full overflow-hidden">
                         <div className="h-full bg-secondary w-[82%]" />
                       </div>
                    </div>
                    <div className="p-3 bg-secondary/5 rounded-xl border border-secondary/10 text-left">
                      <div className="flex gap-2 items-start">
                        <Zap className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <p className="text-[11px] leading-relaxed text-primary">"A stronger candidate would mention the performance trade-offs..."</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold text-primary mb-3">Expert AI Feedback</h3>
                  <p className="text-muted-foreground">Receive mentor-like analysis on clarity, technical precision, and communication style.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary">Get in Touch</h2>
                <p className="text-lg text-muted-foreground">
                  Have questions about our platform or enterprise solutions? Our team of experts is here to help you accelerate your career.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Mail className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Email Us</p>
                    <p className="text-muted-foreground">support@interviewsense.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center border border-secondary/10">
                    <MapPin className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-secondary uppercase tracking-widest">Office</p>
                    <p className="text-muted-foreground">Innovation Drive, Silicon Valley, CA</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Phone className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Call Us</p>
                    <p className="text-muted-foreground">+1 (555) 000-SENZE</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-primary/5">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary/60 uppercase tracking-tighter">First Name</label>
                    <Input placeholder="John" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary/60 uppercase tracking-tighter">Last Name</label>
                    <Input placeholder="Doe" className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary/60 uppercase tracking-tighter">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary/60 uppercase tracking-tighter">Message</label>
                  <Textarea placeholder="How can we help you?" className="min-h-[120px] rounded-xl resize-none" />
                </div>
                <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 gap-2">
                  Send Message <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Trust Bar */}
      <footer className="bg-primary/5 border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquareQuote className="text-white w-5 h-5" />
            </div>
            <span className="font-headline font-bold text-xl text-primary">InterviewSense</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 InterviewSense. Empowering the next generation of professionals.</p>
          <div className="flex gap-6 text-sm text-primary font-medium">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#contact">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
