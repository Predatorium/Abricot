'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { registerUser } from '@/api';

export async function register(formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const username = formData.get('username');

  if (!email || !password || !username) {
    throw new Error('Identifiant et mot de passe requis');
  }

  const result = await registerUser({ email, password, username });
  const { token } = result.data;

  (await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.REACT_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect('/dashboard');
}