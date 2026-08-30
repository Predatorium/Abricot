import { cookies } from "next/headers";
import config from "@/config/config";

// Ce fichier ne doit JAMAIS être importé depuis un composant/context 'use client' -
// cookies() n'existe que côté serveur. Il ne doit être appelé que depuis @/actions ou
// des Server Components.

// Fonction générique servant de couche d'accès à l'API pour tout le projet
// (toutes les autres fonctions de ce fichier/dossier passent par elle)
// method : verbe HTTP ("GET", "POST", "PUT", "DELETE"...)
// path : chemin relatif de l'endpoint (ex: "/health", "/projects/123")
// body : payload optionnel, sérialisé en JSON si présent
export async function apiRequest(method, path, body = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  // Récupération du JWT stocké dans le cookie httpOnly (posé lors du login)
  // pour authentifier la requête auprès du backend
  const token = (await cookies()).get("token")?.value;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = { method, headers };

  // On n'ajoute un body à la requête que s'il est explicitement fourni
  // (évite d'envoyer "null" en JSON sur les requêtes GET/DELETE sans payload)
  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  // Appel au backend, en préfixant le chemin avec l'URL de base configurée
  const response = await fetch(`${config.apiUrl}${path}`, options);

  // Tentative de parsing du corps de la réponse en JSON
  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // Réponse sans body JSON (ex: 204 No Content) : on ignore l'erreur de parsing,
    // data reste à null
  }

  // Si le statut HTTP indique un échec (4xx/5xx), on transforme ça en exception JS
  // pour que les appelants puissent la traiter avec un try/catch classique
  if (!response.ok) {
    // Message d'erreur : celui renvoyé par l'API si disponible, sinon un message générique avec le code HTTP
    const error = new Error(data?.message || `Erreur HTTP ${response.status}`);
    // On attache le statut et le corps de la réponse à l'erreur,
    // pour que l'appelant puisse distinguer les cas (ex: 401 vs 404) si besoin
    error.status = response.status;
    error.data = data;
    throw error;
  }

  // Requête réussie : on renvoie directement les données parsées
  return data;
}

// Simple endpoint de vérification de santé de l'API (utile pour un health check / monitoring)
export function getHealth() {
  return apiRequest("GET", "/health");
}