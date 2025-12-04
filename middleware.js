// middleware.js
// Vercel Edge middleware (Web API) — Basic Auth
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
    // atob is available in the Edge runtime to decode base64
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

  // Allow the request to continue to the static site
  // Returning nothing/undefined lets the platform continue the request.
  return;
}

// Protect all paths except common static files (optional)
export const config = {
  matcher: ['/', '/((?!_next/static|favicon.ico).*)']
};
