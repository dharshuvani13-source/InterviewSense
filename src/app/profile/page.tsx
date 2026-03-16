
"use client"

import React, { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, Save, User, Mail, Trophy, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { updateProfile } from 'firebase/auth'

export default function ProfilePage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [displayName, setDisplayName] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const profileDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);
  
  const { data: profileData, isLoading: profileLoading } = useDoc(profileDocRef);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName)
    } else if (profileData?.displayName) {
      setDisplayName(profileData.displayName)
    }
  }, [user, profileData])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db) return
    
    setIsUpdating(true)
    try {
      // Update Firebase Auth Profile
      await updateProfile(user, { displayName })
      
      // Update Firestore Profile
      const docRef = doc(db, 'userProfiles', user.uid)
      await updateDoc(docRef, { 
        displayName,
        updatedAt: new Date().toISOString()
      })

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully."
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isUserLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const initials = displayName 
    ? displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email ? user.email[0].toUpperCase() : 'U'

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-headline font-bold text-primary mb-2">User Profile</h1>
          <p className="text-muted-foreground text-lg">Manage your identity and track your performance stats.</p>
        </header>

        <div className="max-w-3xl space-y-8">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
            <CardHeader className="flex flex-row items-center gap-6 pb-8">
              <Avatar className="h-24 w-24 border-4 border-primary/10 shadow-lg">
                {user?.photoURL ? <AvatarImage src={user.photoURL} /> : null}
                <AvatarFallback className="bg-primary/5 text-primary text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-headline text-primary">
                  {displayName || 'Anonymous User'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified Member
                  </Badge>
                  {user?.isAnonymous && <Badge variant="outline">Guest</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" /> Full Name
                    </Label>
                    <Input 
                      id="displayName" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="h-11 border-primary/10 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </Label>
                    <Input 
                      value={user?.email || 'N/A'} 
                      disabled 
                      className="h-11 bg-muted/30 border-none cursor-not-allowed"
                    />
                    <p className="text-[10px] text-muted-foreground italic">Email changes are restricted for security.</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isUpdating} className="h-11 px-8 gap-2 font-bold shadow-lg shadow-primary/20">
                    {isUpdating ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" /> Career Standing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{profileData?.knowledgeCredits || 0} KC</div>
                <p className="text-xs text-muted-foreground mt-1">Total Knowledge Credits Accumulated</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-secondary" /> Account Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-primary">
                  {user?.emailVerified ? 'Fully Verified' : 'Standard Access'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last active: {user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Today'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
