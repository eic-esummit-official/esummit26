import type { Metadata } from 'next'

// Nested layouts in Next.js App Router must NOT render <html>, <head> or <body>.
// Those tags are owned exclusively by app/layout.tsx (the root layout).
// This layout simply wraps the page in a full-screen container and sets
// robots: noindex so the test URL stays out of search results.

export const metadata: Metadata = {
  title: 'VentureX Lateral Entry Test — EIC E-Summit 2026',
  description: 'Online screening test for EIC VentureX Lateral Entry. Teams of 1–4 members.',
  robots: { index: false, follow: false },
}

export default function LateralEntryTestLayout({ children }: { children: React.ReactNode }) {
  // The overflow:hidden and background are applied via inline styles inside
  // TestClient.tsx (fixed overlay covers the full viewport).
  return <>{children}</>
}
