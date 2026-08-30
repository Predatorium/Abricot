'use server';

import { redirect } from 'next/navigation';
import { updateProfile, updatePassword } from '@/api';

// Server Action appelée depuis le formulaire de profil (via useActionState / useFormState)
// prevState : état précédent (contient les valeurs actuelles du profil : lastName, firstName, email)
// formData : données du formulaire soumis
export async function Update(prevState, formData) {
  // Récupération des champs, avec chaîne vide par défaut si absents
  const lastName = formData.get('lastName') ?? "";
  const firstName = formData.get('firstName') ?? "";
  const email = formData.get('email') ?? "";
  const newPassword = formData.get('password') ?? "";
  const currentPassword = formData.get('currentPassword') ?? "";

  // Il faut qu'au moins un champ de profil OU un mot de passe soit renseigné
  if (!lastName && !firstName && !email && !newPassword) {
    return { error: 'Veuillez remplir au moins un champ' };
  }

  // Garde-fou : si un nouveau mot de passe est saisi, le mot de passe actuel
  // est obligatoire pour valider le changement côté API (sécurité)
  if (newPassword && !currentPassword) {
    return { error: 'Veuillez renseigner votre mot de passe actuel' };
  }

  try {
    // On ne met à jour le profil que si au moins un champ a réellement changé
    // (évite un appel API inutile si l'utilisateur soumet sans rien modifier)
    if (lastName !== prevState.lastName || firstName !== prevState.firstName || email !== prevState.email) {
      await updateProfile({ email, name: `${firstName} ${lastName}` });
    }

    // Mise à jour du mot de passe uniquement si les deux champs sont fournis
    if (newPassword && currentPassword) {
      await updatePassword({ currentPassword, newPassword });
    }
  } catch (error) {
    // En cas d'échec (API down, mot de passe actuel incorrect, email déjà utilisé, etc.)
    // on renvoie le message d'erreur remonté par l'API si disponible
    return { error: error.message || 'Une erreur est survenue' };
  }

  // Redirection vers la page de profil après mise à jour réussie
  // (placée hors du try/catch pour ne pas être interceptée par le catch)
  redirect('/profile');
}