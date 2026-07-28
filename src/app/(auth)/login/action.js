'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginUser } from '@/api';

export async function login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email et mot de passe requis' };
  }

  try {
    const result = await loginUser({ email, password });
    const { token } = result.data;

    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.REACT_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (err) {
    return { error: 'Identifiants incorrects' };
  }

  redirect('/dashboard');
}