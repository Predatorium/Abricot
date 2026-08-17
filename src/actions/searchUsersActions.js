// actions/userActions.js
'use server';
import { searchUsers } from '@/api/users';

export async function searchUsersAction(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const response = await searchUsers(query);

    if (!response?.success) {
      console.error('searchUsersAction: réponse API en échec', response?.message);
      return [];
    }

    return response.data?.users ?? [];
  } catch (error) {
    console.error('searchUsersAction error:', error);
    return [];
  }
}