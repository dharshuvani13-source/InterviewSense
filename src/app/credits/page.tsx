
"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase'
import { doc } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Trophy, Zap, Star, Sparkles, TrendingUp, Info } from 'lucide-react'

export default function CreditsPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const router = useRouter()

  const profileDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);
  
  const { data: profileData, isLoading: profileLoading } = useDoc(profileDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth')
    }
  }, [user, isUserLoading, router])

  if (isUserLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const knowledgeCredits = profileData?.knowledgeCredits || 0;
  const nextTier = knowledgeCredits > 1000 ? 5000 : knowledgeCredits > 500 ? 1000 : 500;
  const progress = Math.min((knowledgeCredits / nextTier) * 100, 100);
  const currentRank = knowledgeCredits > 1000 ? 'Expert' : knowledgeCredits > 500 ? 'Pro' : 'Beginner';

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-headline font-bold text-primary mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" /> Knowledge Credits
          </h1>
          <p className="text-muted-foreground text-lg">Your professional currency earned through practice and technical excellence.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl bg-primary text-white overflow-hidden relative p-4">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-4 bg-white/20 text-white border-white/30">
                  <Sparkles className="w-3 h-3 mr-1" /> Professional Standing
                </Badge>
                <CardTitle className="text-5xl font-bold flex items-baseline gap-2">
                  {knowledgeCredits} <span className="text-xl font-normal text-white/60">KC</span>
                </CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  Current Rank: <span className="font-bold text-white">{currentRank}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Progress to next tier</span>
                    <span>{knowledgeCredits} / {nextTier} KC</span>
                  </div>
                  <Progress value={progress} className="h-3 bg-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <TrendingUp className="w-5 h-5 mb-1 opacity-60" />
                    <div className="text-sm font-bold">Top 15%</div>
                    <div className="text-[10px] uppercase opacity-60">Global percentile</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <Zap className="w-5 h-5 mb-1 opacity-60" />
                    <div className="text-sm font-bold">Fast Learner</div>
                    <div className="text-[10px] uppercase opacity-60">Active badge</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-4">
              <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
                <Info className="w-6 h-6" /> How to Earn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Mock Interviews', desc: 'Earn up to 100 KC per session based on mentor score.', icon: Star },
                  { title: 'Technical Challenges', desc: 'Solve solving board problems for bonus multipliers.', icon: Zap },
                  { title: 'Voice Accuracy', desc: 'Maintain high clarity in spoken answers for extra points.', icon: Star },
                  { title: 'Daily Consistency', desc: 'Log in and practice daily to keep your streak bonus.', icon: TrendingUp },
                ].map((item, i) => (
                  <Card key={i} className="border-none shadow-md">
                    <CardContent className="pt-6 flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <item.icon className="text-secondary w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-primary">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg">Redeem Rewards</CardTitle>
                <CardDescription>Use your KC for exclusive professional perks.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[
                    { name: 'Expert Portfolio Review', cost: 2000, available: knowledgeCredits >= 2000 },
                    { name: 'Priority Mock Matching', cost: 500, available: knowledgeCredits >= 500 },
                    { name: 'Interview Cheat Sheets', cost: 200, available: knowledgeCredits >= 200 },
                    { name: 'Advanced AI Domains', cost: 0, available: true },
                  ].map((reward, i) => (
                    <div key={i} className="p-4 flex justify-between items-center group hover:bg-muted/30 transition-colors">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-primary">{reward.name}</div>
                        <div className="text-xs text-muted-foreground">{reward.cost} KC</div>
                      </div>
                      <Button size="sm" variant={reward.available ? "default" : "outline"} disabled={!reward.available || reward.cost === 0}>
                        {reward.cost === 0 ? "Unlocked" : "Redeem"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-secondary/5 border-secondary/20">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Pro Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary leading-relaxed">
                  Users with over <span className="font-bold">1,000 Knowledge Credits</span> see a 40% higher confidence rating in real-world interviews. Keep practicing!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
