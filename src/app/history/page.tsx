
"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, orderBy } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, History, Calendar, Award, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HistoryPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const router = useRouter()

  const sessionsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, 'userProfiles', user.uid, 'interviewSessions'),
      orderBy('createdAt', 'desc')
    );
  }, [user, db]);

  const { data: sessions, isLoading: sessionsLoading } = useCollection(sessionsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth')
    }
  }, [user, isUserLoading, router])

  if (isUserLoading || sessionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-headline font-bold text-primary mb-2 flex items-center gap-3">
            <History className="w-10 h-10" /> Interview History
          </h1>
          <p className="text-muted-foreground text-lg">Review your past performances and track your growth over time.</p>
        </header>

        <div className="max-w-5xl">
          {sessions && sessions.length > 0 ? (
            <div className="grid gap-4">
              {sessions.map((session) => (
                <Card key={session.id} className="border-none shadow-md hover:shadow-lg transition-all group overflow-hidden">
                  <div className="h-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xl text-primary">{session.domain}</h3>
                        <Badge variant={session.status === 'completed' ? 'default' : 'outline'}>
                          {session.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {new Date(session.createdAt).toLocaleDateString()}
                        </span>
                        {session.overallScore && (
                          <span className="flex items-center gap-1 font-bold text-secondary">
                            <Award className="w-4 h-4" /> Score: {session.overallScore}/10
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <Link href={`/dashboard`} className="flex-1 md:flex-none">
                        <Button variant="outline" className="w-full gap-2">
                          View Details <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 bg-muted/20">
              <CardContent className="py-20 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <History className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-bold text-primary">No interviews yet</h3>
                  <p className="text-muted-foreground max-w-sm">Complete your first mock interview to start building your professional history.</p>
                </div>
                <Link href="/interview">
                  <Button className="h-12 px-8 font-bold text-lg">Start First Session</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
