import { NextResponse, type NextRequest } from 'next/server'

interface ProxyPayload {
  method?: string
  url?: string
  token?: string
  headers?: Record<string, string>
  body?: string
}

function allowedApiOrigin(): string | null {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!base) return null
  try {
    return new URL(base).origin
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const allowed = allowedApiOrigin()
  if (!allowed) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_API_BASE_URL is not configured' }, { status: 500 })
  }

  let payload: ProxyPayload
  try {
    payload = (await request.json()) as ProxyPayload
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 })
  }

  const method = (payload.method ?? 'GET').toUpperCase()
  if (!payload.url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(payload.url)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }
  if (target.origin !== allowed) {
    return NextResponse.json(
      { error: `Target host not allowed. Only ${allowed} can be reached through the explorer.` },
      { status: 403 }
    )
  }

  const fwdHeaders: Record<string, string> = {}
  for (const [k, v] of Object.entries(payload.headers ?? {})) {
    if (k.trim()) fwdHeaders[k.trim()] = v
  }
  const hasAuth = Object.keys(fwdHeaders).some((k) => k.toLowerCase() === 'authorization')
  if (payload.token && !hasAuth) {
    fwdHeaders['Authorization'] = `Bearer ${payload.token}`
  }

  const hasBody =
    method !== 'GET' && method !== 'HEAD' && payload.body != null && payload.body !== ''
  if (hasBody && !Object.keys(fwdHeaders).some((k) => k.toLowerCase() === 'content-type')) {
    fwdHeaders['Content-Type'] = 'application/json'
  }

  const started = Date.now()
  let upstream: Response
  try {
    upstream = await fetch(target.toString(), {
      method,
      headers: fwdHeaders,
      body: hasBody ? payload.body : undefined,
      redirect: 'manual',
    })
  } catch (err) {
    return NextResponse.json({
      networkError: err instanceof Error ? err.message : 'Upstream request failed',
      durationMs: Date.now() - started,
    })
  }

  const durationMs = Date.now() - started
  const text = await upstream.text()
  const headers: Array<[string, string]> = []
  upstream.headers.forEach((value, key) => headers.push([key, value]))

  return NextResponse.json({
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
    body: text,
    durationMs,
  })
}
