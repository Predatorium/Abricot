import config from "@/config/config";

export async function apiRequest(method, path, body = null) {
  const headers = {
    "Content-Type": "application/json",
  };
 
  const options = {
    method,
    headers,
    credentials: "include", // envoie/reçoit le cookie HttpOnly automatiquement
  };
 
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