import type { NextConfig } from 'next'

// IMPORTANT: NEXT_SERVER_ACTIONS_ENCRYPTION_KEY must be set in production env
// (Dokploy). Without it, every build mints a fresh key and any client that
// still has the previous bundle cached throws:
//   Error: Failed to find Server Action "x". This request might be from an
//   older or newer deployment.
//
// Generate with: openssl rand -base64 32
// The same value must be reused across redeploys (set it once, never rotate
// unless you also want to invalidate every in-flight client session).
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY) {
  console.warn(
    '[platform] NEXT_SERVER_ACTIONS_ENCRYPTION_KEY is not set — Server Action IDs will rotate on every build, ' +
      'causing "Failed to find Server Action" errors for clients with cached bundles. ' +
      'Generate one with `openssl rand -base64 32` and set it in the deployment env.'
  )
}

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
