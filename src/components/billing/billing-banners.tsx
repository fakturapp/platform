'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, HardDrive } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { DASHBOARD_URL } from '@/lib/oauth-config'
import { storageClient, type StorageUsage } from '@/lib/storage-client'

const PLAN_RECOVER_URL = `${DASHBOARD_URL}/dashboard/settings/plan?recover=1`
const STORAGE_URL = `${DASHBOARD_URL}/dashboard/settings/storage`

const BANNER_CLASS =
  'flex w-full items-center justify-center gap-2 bg-red-600 px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-colors hover:bg-red-500'

function daysLeftFrom(iso: string | null | undefined): number | null {
  if (!iso) return null
  const ms = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

export function BillingBanners() {
  const { user } = useAuth()
  const [storage, setStorage] = useState<StorageUsage | null>(null)

  useEffect(() => {
    let active = true
    storageClient.usage().then((res) => {
      if (active && res.data) setStorage(res.data)
    })
    return () => {
      active = false
    }
  }, [user?.currentTeamId])

  const paused = !!user?.subscriptionPaused
  const pastDue = user?.subscriptionStatus === 'past_due'
  const teamName = user?.currentTeamName ?? 'votre équipe'
  const daysLeft = daysLeftFrom(user?.subscriptionGraceEndsAt)

  const showStorage = !!storage && storage.percent >= 80
  const storageFull = storage ? storage.isOver || storage.percent >= 100 : false
  const remaining = storage ? Math.max(0, 100 - Math.round(storage.percent)) : 0

  if (!pastDue && !paused && !showStorage) return null

  const billingLabel = paused
    ? `Abonnement suspendu sur « ${teamName} ». Cliquez pour en savoir plus.`
    : daysLeft !== null
      ? `Paiement échoué sur « ${teamName} ». Régularisez sous ${daysLeft} jour${daysLeft > 1 ? 's' : ''}, sinon retour au plan Gratuit. Cliquez pour régler.`
      : `Paiement échoué sur « ${teamName} ». Cliquez pour régler.`

  return (
    <div className="shrink-0">
      {(pastDue || paused) && (
        <a href={PLAN_RECOVER_URL} target="_blank" rel="noreferrer" className={BANNER_CLASS}>
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>{billingLabel}</span>
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        </a>
      )}
      {showStorage && (
        <a href={STORAGE_URL} target="_blank" rel="noreferrer" className={BANNER_CLASS}>
          <HardDrive className="h-3.5 w-3.5 shrink-0" />
          <span>
            {storageFull
              ? 'Stockage plein. Lecture, création et imports bloqués. Cliquez pour gérer.'
              : `Stockage presque plein. Il vous reste ${remaining}%. Cliquez pour gérer.`}
          </span>
          <HardDrive className="h-3.5 w-3.5 shrink-0" />
        </a>
      )}
    </div>
  )
}
