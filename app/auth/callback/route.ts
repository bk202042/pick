import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const redirectTo = requestUrl.searchParams.get('redirect_to');

    await supabase.auth.exchangeCodeForSession(code);

    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(new URL('/protected', request.url));
}
