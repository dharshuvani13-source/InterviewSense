
"use client"

import React from 'react'
import Link from 'link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Mic2, 
  History, 
  Settings, 
  LayoutDashboard, 
  Trophy,
  MessageSquareQuote,
  Zap,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth, useUser } from '@/firebase'
import { signOut } from 'firebase/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Voice Assistant', href: '/assistant', icon: Mic2 },
  { name: 'Interview Mode', href: '/interview', icon: Zap },
  { name: 'History', href: '/history', icon: History },
  { name: 'Credits', href: '/credits', icon: Trophy },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const auth = useAuth()
  const { user } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut(auth)
    router.push('/')
  }

  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email ? user.email[0].toUpperCase() : 'U'

  return (
    <aside className="w-64 border-r bg-white flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <MessageSquareQuote className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">InterviewSense</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
              pathname === item.href 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted"
            )}>
              <item.icon className="w-5 h-5" />
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      <div className="px-4 py-6 mt-auto space-y-4">
        <Separator className="mb-4" />
        
        <Link href="/profile">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
            pathname === '/profile' ? "bg-primary/10" : "hover:bg-muted"
          )}>
            <Avatar className="h-8 w-8 border border-primary/10">
              {user?.photoURL ? <AvatarImage src={user.photoURL} /> : null}
              <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-primary truncate">
                {user?.displayName || 'Professional'}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">View Profile</span>
            </div>
          </div>
        </Link>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive h-9 px-3"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
