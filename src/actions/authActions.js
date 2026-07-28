'use server';
 
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getProfile, updateProfile, updatePassword } from '@/api';
 
export async function getProfileAction() {
  return getProfile();
}
 
export async function updateProfileAction(profileData) {
  return updateProfile(profileData);
}
 
export async function updatePasswordAction(passwordData) {
  return updatePassword(passwordData);
}
 
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/login');
}