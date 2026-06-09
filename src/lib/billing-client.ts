import { api } from '@/lib/api'

export interface BillingSyncResult {
  synced: boolean
  plan?: string
  status?: string
}

export const billingClient = {
  sync: () => api.post<BillingSyncResult>('/billing/sync', {}),
}
