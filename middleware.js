// middleware.js (DEBUG) — temporary, forces a 401 and adds a debug header
export function middleware(request) {
  return new Response('Debug: auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected"',
      'X-Middleware-Debug': 'true'
    }
  });
}

export const config = {
  matcher: ['/', '/((?!_next/static|favicon.ico).*)']
};
