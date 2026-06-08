'use client'

import { useEffect, useState } from 'react'
import { HardDrive } from 'lucide-react'
import { storageClient, type StorageUsage } from '@/lib/storage-client'

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} o`
  const kb = n / 1024
  if (kb < 1024) return `${kb.toFixed(0)} Ko`
  const mb = kb / 1024
  if (mb < 1024) return `${mb < 10 ? mb.toFixed(1) : mb.toFixed(0)} Mo`
  const gb = mb / 1024
  return `${gb < 10 ? gb.toFixed(1) : gb.toFixed(0)} Go`
}

export function StorageMeter() {
  const [usage, setUsage] = useState<StorageUsage | null>(null)

  useEffect(() => {
    let active = true
    storageClient.usage().then((res) => {
      if (active && res.data) setUsage(res.data)
    })
    return () => {
      active = false
    }
  }, [])

  if (!usage) return null

  const pct = Math.min(100, Math.max(0, Math.round(usage.percent)))
  const tone = pct >= 90 ? 'bg-danger' : pct >= 70 ? 'bg-warning' : 'bg-accent'

  return (
    <div className="px-4 pb-1.5 pt-1">
      <div className="mb-1.5 flex items-center gap-1.5 text-muted-foreground">
        <HardDrive className="h-3.5 w-3.5" />
        <span className="text-[11px] font-medium">Stockage</span>
        <span className="ml-auto text-[10px] tabular-nums">
          {fmtBytes(usage.totalBytes)} / {fmtBytes(usage.quotaBytes)}
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Stockage utilisé"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${tone}`}
          style={{ width: `${Math.max(2, pct)}%` }}
        />
      </div>
    </div>
  )
}
