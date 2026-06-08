'use client'

import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DASHBOARD_URL } from '@/lib/oauth-config'

const PLAN_URL = `${DASHBOARD_URL}/dashboard/settings/plan`

interface ProGateProps {
  locked: boolean
  title?: string
  description?: string
  children: ReactNode
}

export function ProGate({
  locked,
  title = 'Réservé à Faktur Pro',
  description = 'Passez à Pro pour débloquer cette fonctionnalité.',
  children,
}: ProGateProps) {
  if (!locked) return <>{children}</>

  return (
    <div className="relative">
      <div className="pointer-events-none select-none opacity-40" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-start justify-center p-4 pt-20">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card/95 p-6 text-center shadow-lg backdrop-blur-sm">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Lock className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          <a href={PLAN_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex">
            <Button size="sm">Passer à Pro</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
