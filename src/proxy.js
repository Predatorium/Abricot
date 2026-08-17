import { NextResponse } from 'next/server';

export function proxy(request) {
  const token = request.cookies.get('token');

  if (request.nextUrl.pathname === '/') {
    if (token?.value) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

export const config = {
  matcher: '/',
};