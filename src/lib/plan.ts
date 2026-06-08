import type { PlatformPlan } from '@/lib/auth'

export function isProPlan(plan: PlatformPlan | null | undefined): boolean {
  return plan === 'pro' || plan === 'team'
}

export function isTeamPlan(plan: PlatformPlan | null | undefined): boolean {
  return plan === 'team'
}

export function planLabel(plan: PlatformPlan | null | undefined): string {
  if (plan === 'pro') return 'Pro'
  if (plan === 'team') return 'Team'
  return 'Free'
}

export function apiKeyLimit(plan: PlatformPlan | null | undefined): number {
  if (plan === 'team') return 5
  if (plan === 'pro') return 2
  return 1
}

export function projectLimit(plan: PlatformPlan | null | undefined): number {
  if (plan === 'team') return 20
  if (plan === 'pro') return 3
  return 1
}
