'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiKey } from '@/lib/api-key-context'
import { UsagePanel } from '@/components/api-keys/usage-panel'

export default function UsagePage() {
  const { apiKey } = useApiKey()

  if (!apiKey) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-5 space-y-2">
                  <Skeleton className="h-3 w-24 rounded-md" />
                  <Skeleton className="h-9 w-32 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex h-32 items-end gap-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1 rounded-t"
                    style={{ height: `${20 + ((i * 37) % 80)}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3">
                    <Skeleton className="h-4 w-64 shrink-0 rounded-md" />
                    <Skeleton className="h-1.5 flex-1 rounded-full" />
                    <Skeleton className="h-3 w-12 shrink-0 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[60px_1fr_60px_70px_90px] items-center gap-3 px-5 py-2.5"
                  >
                    <Skeleton className="h-3 w-10 rounded-md" />
                    <Skeleton className="h-3 w-48 rounded-md" />
                    <Skeleton className="h-3 w-10 justify-self-end rounded-md" />
                    <Skeleton className="h-3 w-12 justify-self-end rounded-md" />
                    <Skeleton className="h-3 w-16 justify-self-end rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Skeleton className="h-4 w-44 rounded-md" />
          </div>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1.5 text-center">
                    <Skeleton className="h-1.5 w-full rounded-full" />
                    <Skeleton className="mx-auto h-3 w-10 rounded-md" />
                    <Skeleton className="mx-auto h-3 w-20 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <UsagePanel apiKey={apiKey} />
}
