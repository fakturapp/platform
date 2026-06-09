'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiKey } from '@/lib/api-key-context'
import { DeliveriesPanel } from '@/components/api-keys/deliveries-panel'

export default function DeliveriesPage() {
  const { apiKey } = useApiKey()

  if (!apiKey) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 px-5 py-4"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-48 rounded-md" />
                    <Skeleton className="h-3 w-60 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <DeliveriesPanel apiKey={apiKey} />
}
