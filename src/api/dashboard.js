import { apiRequest } from "@/api/client"

// Réponse: { success, message, data: { tasks } }
export function getAssignedTasks() {
  return apiRequest("GET", "/dashboard/assigned-tasks");
}

// Réponse: { success, message, data: { projects } } (chaque projet inclut ses tasks)
export function getProjectsWithTasks() {
  return apiRequest("GET", "/dashboard/projects-with-tasks");
}

// Route bonus présente dans dashboardController.ts mais absente du Swagger
// Réponse: { success, message, data: { stats } }
export function getDashboardStats() {
  return apiRequest("GET", "/dashboard/stats");
}
