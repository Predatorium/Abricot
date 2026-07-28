import { apiRequest } from "@/api/client"

// Défini dans projectController.ts mais exposé sur /users/search
// Réponse: { success, message, data: { users } }
export function searchUsers(query) {
  return apiRequest("GET", `/users/search?query=${encodeURIComponent(query)}`);
}
