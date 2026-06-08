import { api } from '@/lib/api'

export interface StorageUsage {
  fileBytes: number
  docBytes: number
  totalBytes: number
  quotaBytes: number
  percent: number
  isOver: boolean
  plan: 'free' | 'pro' | 'team'
}

export const storageClient = {
  usage: () => api.get<StorageUsage>('/storage/usage'),
}
