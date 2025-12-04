// middleware.js
export function middleware(request) {
  const AUTH_USER = process.env.BASIC_AUTH_USER || 'admin';
  const AUTH_PASS = process.env.BASIC_AUTH_PASS || 'changeme';

  const auth = request.headers.get('authorization') || '';

  if (!auth) {
    return new Response('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' }
    });
  }

  const m = auth.match(/^Basic\s+(.+)$/i);
  if (!m) {
    return new Response('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' }
    });
  }

  let creds = '';
  try {
    creds = atob(m[1]);
  } catch (e) {
    return new Response('Invalid auth token', { status: 400 });
  }

  if (creds !== `${AUTH_USER}:${AUTH_PASS}`) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' }
    });
  }

  return;
}

export const config = {
  matcher: ['/', '/((?!_next/static|favicon.ico).*)']
};
