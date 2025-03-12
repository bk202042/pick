'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';
import { headers } from 'next/headers';

export async function signUpAction(formData: FormData) {
  const origin = headers().get('origin');
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return redirect('/sign-up?message=Missing email or password');
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/sign-up?message=${error.message}`);
  }

  return redirect('/sign-in?message=Check your email to confirm your sign-up');
}

export async function signInAction(formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return redirect('/sign-in?message=Missing email or password');
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/sign-in?message=Invalid email or password');
  }

  return redirect('/protected');
}

export async function forgotPasswordAction(formData: FormData) {
  const origin = headers().get('origin');
  const email = formData.get('email')?.toString();

  if (!email) {
    return redirect('/forgot-password?message=Email is required');
  }

  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/protected/reset-password`,
  });

  if (error) {
    return redirect('/forgot-password?type=error&message=Could not reset password');
  }

  return redirect('/forgot-password?message=Password reset email sent');
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();

  if (!password || !confirmPassword) {
    return redirect('/protected/reset-password?message=Passwords are required');
  }

  if (password !== confirmPassword) {
    return redirect('/protected/reset-password?type=error&message=Passwords do not match');
  }

  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return redirect('/protected/reset-password?type=error&message=Password update failed');
  }

  return redirect('/protected/reset-password?message=Password updated successfully');
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
}

function headers() {
  return new Headers({
    'x-url': 'http://localhost:3000',
  });
}
