import { apiRequest } from "@/api/client"

export function registerUser({ email, password, username }) {
  return apiRequest("POST", "/auth/register", { email, password, username });
}
 
export function loginUser({ email, password }) {
  // Si le backend pose bien le cookie HttpOnly via Set-Cookie,
  // la réponse JSON ne devrait plus contenir le token en clair.
  return apiRequest("POST", "/auth/login", { email, password });
}
 
export function getProfile() {
  return apiRequest("GET", "/auth/profile");
}
 
export function updateProfile(profileData) {
  return apiRequest("PUT", "/auth/profile", profileData);
}
 
export function updatePassword({ currentPassword, newPassword }) {
  return apiRequest("PUT", "/auth/password", { currentPassword, newPassword });
}