'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiKey } from '@/lib/api-key-context'
import { WebhookConfigPanel } from '@/components/api-keys/webhook-config-panel'
import { WebhookDeliveryConfigPanel } from '@/components/api-keys/webhook-delivery-config-panel'

export default function WebhookPage() {
  const { apiKey, webhook, reload } = useApiKey()

  if (!apiKey) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          <Card className="border-border/50">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-3 w-72 rounded-md" />
              </div>
              <div className="rounded-lg border border-border/50 bg-surface p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <Skeleton className="h-3 w-32 rounded-md" />
                    <Skeleton className="h-4 w-48 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <Card className="border-border/50">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
              <div className="rounded-lg border border-border/50 bg-surface">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 border-b border-border/30 last:border-0"
                  >
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <Skeleton className="ml-auto h-3 w-28 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Skeleton className="h-10 w-44 rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <WebhookConfigPanel apiKey={apiKey} webhook={webhook} onChanged={reload} />
      {webhook && <WebhookDeliveryConfigPanel apiKeyId={apiKey.id} />}
    </div>
  )
}
