'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, onUnauthorized } from '@/lib/api'
import { OAUTH_REVOKE_URL } from '@/lib/oauth-config'
import {
  clearTokens,
  getCurrentTeamId,
  getStoredAccessToken,
  setCurrentTeamId as persistCurrentTeamId,
} from '@/lib/oauth-storage'

export type PlatformPlan = 'free' | 'pro' | 'team'

export interface PlatformTeam {
  id: string
  name: string
  iconUrl: string | null
  role: 'super_admin' | 'admin' | 'member' | 'viewer'
  encryptionMode: 'private' | 'standard'
  plan: PlatformPlan
}

export interface PlatformUser {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  currentTeamId: string | null
  currentTeamName: string | null
  currentTeamEncryptionMode: 'private' | 'standard'
  currentTeamPlan: PlatformPlan
  subscriptionStatus: string | null
  subscriptionGraceEndsAt: string | null
  subscriptionPaused: boolean
  apiGraceEndsAt: string | null
}

interface AuthContextValue {
  user: PlatformUser | null
  teams: PlatformTeam[]
  currentTeam: PlatformTeam | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  selectTeam: (teamId: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface MeResponse {
  user: {
    id: string
    email: string
    fullName: string | null
    avatarUrl: string | null
    currentTeamId: string | null
    currentTeamName?: string | null
    currentTeamEncryptionMode?: 'private' | 'standard'
    currentTeamPlan?: PlatformPlan | null
    teams?: Array<{
      id: string
      subscriptionStatus?: string | null
      subscriptionGraceEndsAt?: string | null
      subscriptionPaused?: boolean
      apiGraceEndsAt?: string | null
    }>
  }
}

interface TeamsResponse {
  teams: Array<{
    id: string
    name: string
    iconUrl: string | null
    role: PlatformTeam['role']
    encryptionMode: 'private' | 'standard'
    plan?: PlatformPlan | null
  }>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PlatformUser | null>(null)
  const [teams, setTeams] = useState<PlatformTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMe = useCallback(async (silent = false) => {
    const token = getStoredAccessToken()
    if (!token) {
      setUser(null)
      setTeams([])
      setLoading(false)
      return
    }

    if (!silent) setLoading(true)
    setError(null)

    const meRes = await api.get<MeResponse>('/auth/me')
    if (meRes.error || !meRes.data?.user) {
      setUser(null)
      setTeams([])
      setLoading(false)
      if (meRes.error && meRes.errorCode !== 'invalid_token') {
        setError(meRes.error)
      }
      return
    }

    const teamsRes = await api.get<TeamsResponse>('/team/all')
    const teamsList: PlatformTeam[] = (teamsRes.data?.teams ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      iconUrl: t.iconUrl,
      role: t.role,
      encryptionMode: t.encryptionMode,
      plan: t.plan ?? 'free',
    }))
    setTeams(teamsList)

    const persistedTeamId = getCurrentTeamId()
    const effectiveTeamId =
      teamsList.find((t) => t.id === persistedTeamId)?.id ??
      meRes.data.user.currentTeamId ??
      teamsList[0]?.id ??
      null

    if (effectiveTeamId) persistCurrentTeamId(effectiveTeamId)
    const activeTeam = teamsList.find((t) => t.id === effectiveTeamId) ?? null
    const meTeam = meRes.data.user.teams?.find((t) => t.id === effectiveTeamId) ?? null

    setUser({
      id: meRes.data.user.id,
      email: meRes.data.user.email,
      fullName: meRes.data.user.fullName,
      avatarUrl: meRes.data.user.avatarUrl,
      currentTeamId: effectiveTeamId,
      currentTeamName: activeTeam?.name ?? meRes.data.user.currentTeamName ?? null,
      currentTeamEncryptionMode:
        activeTeam?.encryptionMode ??
        meRes.data.user.currentTeamEncryptionMode ??
        'standard',
      currentTeamPlan: activeTeam?.plan ?? meRes.data.user.currentTeamPlan ?? 'free',
      subscriptionStatus: meTeam?.subscriptionStatus ?? null,
      subscriptionGraceEndsAt: meTeam?.subscriptionGraceEndsAt ?? null,
      subscriptionPaused: !!meTeam?.subscriptionPaused,
      apiGraceEndsAt: meTeam?.apiGraceEndsAt ?? null,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  useEffect(() => {
    const off = onUnauthorized(() => {
      setUser(null)
      setTeams([])
    })
    return () => off()
  }, [])

  useEffect(() => {
    if (!user) return

    const HEARTBEAT_MS = 30_000

    async function ping() {
      if (!getStoredAccessToken()) return
      await fetchMe(true)
    }

    const interval = window.setInterval(ping, HEARTBEAT_MS)

    function onVisibility() {
      if (document.visibilityState === 'visible') {
        ping()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', ping)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', ping)
    }
  }, [user, fetchMe])

  const selectTeam = useCallback(
    async (teamId: string) => {
      persistCurrentTeamId(teamId)
      const teamsRes = await api.post<{ team: PlatformTeam }>('/team/switch', { teamId })
      if (teamsRes.error) {
        setError(teamsRes.error)
        return
      }
      await fetchMe()
    },
    [fetchMe]
  )

  const signOut = useCallback(async () => {
    const token = getStoredAccessToken()
    if (token) {
      try {
        await fetch(OAUTH_REVOKE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ token }).toString(),
        })
      } catch {
        
      }
    }
    clearTokens()
    setUser(null)
    setTeams([])
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }, [])

  const currentTeam = useMemo(
    () => teams.find((t) => t.id === user?.currentTeamId) ?? null,
    [teams, user?.currentTeamId]
  )

  const value: AuthContextValue = {
    user,
    teams,
    currentTeam,
    loading,
    error,
    refresh: fetchMe,
    selectTeam,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
