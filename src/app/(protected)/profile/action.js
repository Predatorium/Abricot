'use server';

import { redirect } from 'next/navigation';
import { updateProfile, updatePassword } from '@/api';

export async function Update(prevState, formData) {
  const lastName = formData.get('lastName') ?? "";
  const firstName = formData.get('firstName') ?? "";
  const email = formData.get('email') ?? "";
  const password = formData.get('password') ?? "";
  const currentPassword = formData.get('currentPassword') ?? "";

  if (!lastName && !firstName && !email && !password) {
    return { error: 'Veuillez remplir au moins un champ' };
  }

  try {
    if (lastName !== prevState.lastName || firstName !== prevState.firstName || email !== prevState.email) {
      await updateProfile({ email, name: `${firstName} ${lastName}` });
    }

    if (password && currentPassword) {
      await updatePassword({ currentPassword, newPassword: password });
    }
  } catch (error) {
    return { error: error.message || 'Une erreur est survenue' };
  }

  redirect('/profile');
}