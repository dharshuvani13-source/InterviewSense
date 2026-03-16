
"use client"

import React from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Trophy, 
  Mic2, 
  Clock, 
  TrendingUp,
  BrainCircuit,
  MessageSquareQuote,
  ArrowRight,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUser } from '@/firebase'

export default function DashboardPage() {
  const { user, isUserLoading } = useUser()

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || "Professional"

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary mb-2">Welcome Back, {displayName}</h1>
            <p className="text-muted-foreground text-lg">Your interview readiness is at <span className="text-primary font-bold">78%</span></p>
          </div>
          <div className="flex gap-4">
            <Link href="/assistant">
              <Button className="gap-2 h-12 px-6 rounded-xl shadow-lg shadow-primary/20">
                <Mic2 className="w-5 h-5" /> Quick Voice Query
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Credits</CardTitle>
              <Trophy className="text-yellow-500 w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-xs text-muted-foreground mt-1">Start practicing to earn</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Practice Time</CardTitle>
              <Clock className="text-primary w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">0 hrs</div>
              <p className="text-xs text-muted-foreground mt-1">Goal: 15 hrs</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Interviews</CardTitle>
              <Zap className="text-secondary w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-xs text-muted-foreground mt-1">Sessions completed</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Skill Level</CardTitle>
              <TrendingUp className="text-green-500 w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">Newcomer</div>
              <p className="text-xs text-muted-foreground mt-1">Level up your skills</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-headline font-bold text-primary mb-4 flex items-center gap-2">
                <BrainCircuit className="w-6 h-6" /> Recommended Focus
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/interview">
                  <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all group cursor-pointer">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">System Design Basics</h3>
                      <p className="text-sm text-muted-foreground mb-4">Focus on microservices architectures and database scaling.</p>
                      <div className="flex justify-between items-center">
                         <Badge variant="secondary">Tech</Badge>
                         <span className="text-primary font-medium flex items-center gap-1 text-sm">Start <ArrowRight className="w-4 h-4" /></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/interview">
                  <Card className="border-l-4 border-l-secondary hover:shadow-lg transition-all group cursor-pointer">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-secondary transition-colors">HR Soft Skills</h3>
                      <p className="text-sm text-muted-foreground mb-4">Refine your 'Tell me about yourself' pitch using AI voice feedback.</p>
                      <div className="flex justify-between items-center">
                         <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">Behavioral</Badge>
                         <span className="text-secondary font-medium flex items-center gap-1 text-sm">Start <ArrowRight className="w-4 h-4" /></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-primary mb-4">Recent Sessions</h2>
              <Card className="border-none shadow-md">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-lg text-primary">No sessions yet</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1">Start your first mock interview to track your progress and earn credits.</p>
                  <Link href="/interview">
                    <Button className="mt-6">Begin Practice</Button>
                  </Link>
                </CardContent>
              </Card>
            </section>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl bg-primary text-white overflow-hidden relative">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <CardHeader>
                <CardTitle className="font-headline">Knowledge Credits</CardTitle>
                <div className="text-4xl font-bold mt-2">0 <span className="text-white/60 text-lg font-normal">KC</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Rank: Beginner</span>
                    <span>0% to Professional</span>
                  </div>
                  <Progress value={0} className="bg-white/20" />
                </div>
                <Button variant="secondary" className="w-full font-bold" disabled>Redeem Rewards</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquareQuote className="text-secondary" /> Daily Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "When asked about a weakness, always provide a genuine one but immediately pivot to how you're actively working to improve it with concrete examples."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
