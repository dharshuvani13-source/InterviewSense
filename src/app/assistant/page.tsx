"use client"

import React from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { VoiceInteraction } from '@/components/voice/VoiceInteraction'

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-12">
          <h1 className="text-4xl font-headline font-bold text-primary mb-2">Voice AI Assistant</h1>
          <p className="text-muted-foreground text-lg">Speak naturally and get expert career & tech advice.</p>
        </header>
        
        <VoiceInteraction />
      </main>
    </div>
  )
}
