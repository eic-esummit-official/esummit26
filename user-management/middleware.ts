import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'um_session'
const PUBLIC_PATHS = ['/login', '/api/auth']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow requests to public paths (login page + auth API)
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Allow Next.js internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/esummit') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.webp')
  ) {
    return NextResponse.next()
  }

  const session = req.cookies.get(SESSION_COOKIE)

  if (!session?.value) {
    // Redirect to login, preserving the original destination
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.search = `?from=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except Next.js internals
  matcher: ['/((?!_next/static|_next/image).*)'],
}
