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

  const rawName = email.match(/^[a-zA-Z]+/)?.[0] ?? email;
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

  const result = await registerUser({ email, password, name });
  const { token } = result.data;

  (await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.REACT_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, //30 jours
  });

  redirect('/dashboard');
}