'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiKey } from '@/lib/api-key-context'
import { LogsPanel } from '@/components/api-keys/logs-panel'

export default function LogsPage() {
  const { apiKey } = useApiKey()

  if (!apiKey) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-7 w-14 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr,minmax(0,360px)]">
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-5 py-3"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-56 rounded-md" />
                      <Skeleton className="h-3 w-40 rounded-md" />
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Skeleton className="h-4 w-10 rounded-md" />
                      <Skeleton className="h-3 w-12 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 hidden lg:block">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-48 rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <LogsPanel apiKey={apiKey} />
}
