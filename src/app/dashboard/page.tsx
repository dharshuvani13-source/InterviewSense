
"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { useUser, useDoc, useCollection, useMemoFirebase, useFirestore } from '@/firebase'
import { doc, collection, query, orderBy, limit } from 'firebase/firestore'

export default function DashboardPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const router = useRouter()

  // Authentication redirect
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth')
    }
  }, [user, isUserLoading, router])

  // Real-time User Profile Data fetched via official hooks
  const profileDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);
  
  const { data: profileData, isLoading: profileLoading } = useDoc(profileDocRef);
  
  const sessionsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, 'userProfiles', user.uid, 'interviewSessions'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [user, db]);

  const { data: sessions, isLoading: sessionsLoading } = useCollection(sessionsQuery);

  if (isUserLoading || sessionsLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null;

  const displayName = user?.displayName || user?.email?.split('@')[0] || "Professional"
  const knowledgeCredits = profileData?.knowledgeCredits || 0;
  const sessionsCount = sessions?.length || 0;

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary mb-2">Welcome Back, {displayName}</h1>
            <p className="text-muted-foreground text-lg">You have completed <span className="text-primary font-bold">{sessionsCount}</span> mock sessions.</p>
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
              <div className="text-3xl font-bold text-primary">{knowledgeCredits}</div>
              <p className="text-xs text-muted-foreground mt-1">Accumulated Rank</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Practice Sessions</CardTitle>
              <Clock className="text-primary w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{sessionsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Total interviews</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Active Level</CardTitle>
              <Zap className="text-secondary w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{knowledgeCredits > 500 ? 'Pro' : 'Beginner'}</div>
              <p className="text-xs text-muted-foreground mt-1">Performance Tier</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Skill Trend</CardTitle>
              <TrendingUp className="text-green-500 w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{knowledgeCredits > 0 ? '+12%' : '0%'}</div>
              <p className="text-xs text-muted-foreground mt-1">Weekly progress</p>
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
                <CardContent className="p-0">
                  {sessions && sessions.length > 0 ? (
                    <div className="divide-y">
                      {sessions.map((session) => (
                        <div key={session.id} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                          <div>
                            <div className="font-bold text-primary">{session.domain}</div>
                            <div className="text-xs text-muted-foreground">{new Date(session.createdAt).toLocaleDateString()}</div>
                          </div>
                          <Badge variant={session.status === 'completed' ? 'default' : 'outline'}>
                            {session.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-bold text-lg text-primary">No sessions yet</h3>
                      <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1">Start your first mock interview to track your progress and earn credits.</p>
                      <Link href="/interview">
                        <Button className="mt-6">Begin Practice</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl bg-primary text-white overflow-hidden relative">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <CardHeader>
                <CardTitle className="font-headline">Knowledge Credits</CardTitle>
                <div className="text-4xl font-bold mt-2">{knowledgeCredits} <span className="text-white/60 text-lg font-normal">KC</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Rank: {knowledgeCredits > 1000 ? 'Expert' : knowledgeCredits > 500 ? 'Pro' : 'Beginner'}</span>
                    <span>{Math.min(Math.floor((knowledgeCredits / 1000) * 100), 100)}% to next tier</span>
                  </div>
                  <Progress value={Math.min((knowledgeCredits / 1000) * 100, 100)} className="bg-white/20" />
                </div>
                <Link href="/credits">
                  <Button variant="secondary" className="w-full font-bold">Manage Credits</Button>
                </Link>
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
