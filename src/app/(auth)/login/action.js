'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginUser } from '@/api';
import config from '@/config/config';

// Server Action appelée depuis le formulaire de connexion (via useActionState / useFormState)
// prevState : état précédent renvoyé par le hook côté client
// formData : données du formulaire soumis (email, password)
export async function Login(prevState, formData) {
  // Récupération des champs du formulaire
  const email = formData.get('email');
  const password = formData.get('password');

  // Validation basique : on vérifie juste que les champs ne sont pas vides
  if (!email || !password) {
    return { error: 'Email et mot de passe requis' };
  }

  try {
    // Appel à l'API pour authentifier l'utilisateur
    const result = await loginUser({ email, password });

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
    // En cas d'échec de l'authentification (mauvais identifiants, erreur API, etc.)
     console.error('Login error:', err);
     return { error: 'Identifiants incorrects' };
  }

  // Redirection vers le dashboard après connexion réussie
  // (placée hors du try/catch pour ne pas être interceptée par le catch)
  redirect('/dashboard');
}