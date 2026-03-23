import { NextRequest, NextResponse } from 'next/server';

export default function proxy(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login');
  const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin');

  if (isAdminRoute || isApiAdminRoute) {
    // Check for the session token cookie
    const sessionToken = req.cookies.get('authjs.session-token') || req.cookies.get('__Secure-authjs.session-token');

    if (!sessionToken) {
      if (isApiAdminRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
