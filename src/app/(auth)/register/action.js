'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { registerUser } from '@/api';

export async function Register(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    throw new Error('Identifiant et mot de passe requis');
  }

  const result = await registerUser({ email, password, username: email });
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