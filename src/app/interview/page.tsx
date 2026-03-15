"use client"

import React from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { MockInterviewSession } from '@/components/interview/MockInterviewSession'

export default function InterviewPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-12">
          <h1 className="text-4xl font-headline font-bold text-primary mb-2">Interview Practice Mode</h1>
          <p className="text-muted-foreground text-lg">Sharpen your skills with realistic AI-driven mock interviews.</p>
        </header>
        
        <MockInterviewSession />
      </main>
    </div>
  )
}
