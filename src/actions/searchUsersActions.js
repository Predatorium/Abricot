'use server';

import { searchUsers } from '@/api/users';

// Server Action utilisée pour rechercher des utilisateurs (ex: dans UserMultiSelect en mode "async")
// query : texte saisi par l'utilisateur dans le champ de recherche
export async function searchUsersAction(query) {
  // On évite d'appeler l'API pour une requête vide ou trop courte
  // (moins de 2 caractères = trop de résultats/bruit, et économise des appels inutiles)
  if (!query || query.trim().length < 2) return [];

  try {
    // Appel à l'API de recherche d'utilisateurs
    const response = await searchUsers(query);

    // La réponse API porte un flag "success" en plus du statut HTTP :
    // si l'appel a "réussi" techniquement mais que l'API signale un échec métier, on logue et on renvoie une liste vide
    if (!response?.success) {
      console.error('searchUsersAction: réponse API en échec', response?.message);
      return [];
    }

    // Extraction de la liste d'utilisateurs, avec fallback sur un tableau vide si absente
    return response.data?.users ?? [];
  } catch (error) {
    // En cas d'erreur réseau/exception (timeout, API down, etc.), on logue et on renvoie une liste vide
    // plutôt que de faire planter le composant appelant
    console.error('searchUsersAction error:', error);
    return [];
  }
}