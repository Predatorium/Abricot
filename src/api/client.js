import { cookies } from "next/headers";
import config from "@/config/config";

// Ce fichier ne doit JAMAIS être importé depuis un composant/context 'use client' -
// cookies() n'existe que côté serveur. Il ne doit être appelé que depuis @/actions ou
// des Server Components.
export async function apiRequest(method, path, body = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = (await cookies()).get("token")?.value;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = { method, headers };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${config.apiUrl}${path}`, options);

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // pas de body JSON (ex: 204 No Content)
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Erreur HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function getHealth() {
  return apiRequest("GET", "/health");
}
