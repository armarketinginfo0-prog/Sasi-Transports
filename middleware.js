// middleware.js
import { NextResponse } from 'next/server';

// Basic Auth middleware for Vercel Edge
export function middleware(req) {
  const AUTH_USER = process.env.BASIC_AUTH_USER || 'admin';
  const AUTH_PASS = process.env.BASIC_AUTH_PASS || 'changeme';

  const auth = req.headers.get('authorization') || '';

  if (!auth) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' }
    });
  }

  const match = auth.match(/^Basic\s+(.+)$/i);
  if (!match) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' }
    });
  }

  // decode base64
  let creds = '';
  try {
    creds = Buffer.from(match[1], 'base64').toString('utf8');
  } catch (e) {
    return new NextResponse('Invalid auth', { status: 400 });
  }

  if (creds !== `${AUTH_USER}:${AUTH_PASS}`) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' }
    });
  }

  return NextResponse.next();
}

// protect all routes (but allow next.js static files and favicon)
export const config = {
  matcher: ['/', '/((?!_next/static|favicon.ico).*)']
};
