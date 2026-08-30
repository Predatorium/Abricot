'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { registerUser } from '@/api';
import config from '@/config/config';

// Server Action appelée depuis le formulaire d'inscription (via useActionState / useFormState)
// prevState : état précédent renvoyé par le hook côté client
// formData : données du formulaire soumis (email, password)
export async function Register(prevState, formData) {
  // Récupération des champs du formulaire
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  // Validation basique : on vérifie juste que les champs ne sont pas vides
  if (!email || !password) {
    return { error: 'Identifiant et mot de passe requis' };
  }

  // Isole la partie avant le @, puis découpe sur les séparateurs habituels (. _ - +)
  const localPart = email.split('@')[0];
  const rawName = localPart.split(/[._\-+0-9]+/).find(Boolean) ?? localPart;
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

  try {
    // Appel à l'API pour créer le compte utilisateur
    const result = await registerUser({ email, password, name });

    // On récupère le token renvoyé par l'API en cas de succès
    const { token } = result.data;

    // Stockage du token dans un cookie sécurisé côté serveur
    (await cookies()).set('token', token, {
      httpOnly: true, // inaccessible en JS côté client (protection contre le XSS)
      secure: config.env === 'production', // cookie envoyé uniquement en HTTPS en prod
      sameSite: 'lax', // protection basique contre le CSRF
      path: '/', // cookie valable sur tout le site
      maxAge: 60 * 60 * 24 * 7, // durée de vie du cookie : 7 jours
    });
  } catch (err) {
    // En cas d'échec de l'inscription (email déjà utilisé, erreur serveur, etc.)
    console.error('Register error:', err);
    return { error: 'Impossible de créer le compte' };
  }

  // Redirection vers le dashboard après inscription réussie
  // (placée hors du try/catch pour ne pas être interceptée par le catch)
  redirect('/dashboard');
}