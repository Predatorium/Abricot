import { apiRequest } from "@/api/client"

// authController.ts attend { email, password, name } - PAS "username"
export function registerUser({ email, password, name }) {
  return apiRequest("POST", "/auth/register", { email, password, name });
}

export function loginUser({ email, password }) {
  return apiRequest("POST", "/auth/login", { email, password });
}

// Réponse: { success, message, data: { user } }
export function getProfile() {
  return apiRequest("GET", "/auth/profile");
}

// Réponse: { success, message, data: { user } }
export function updateProfile(profileData) {
  return apiRequest("PUT", "/auth/profile", profileData);
}

// Réponse: { success, message } - pas de data
export function updatePassword({ currentPassword, newPassword }) {
  return apiRequest("PUT", "/auth/password", { currentPassword, newPassword });
}
