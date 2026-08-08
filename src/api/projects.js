import { apiRequest } from "@/api/client"

// Réponse: { success, message, data: { project } }
export function createProject(projectData) {
  return apiRequest("POST", "/projects", projectData);
}

// Réponse: { success, message, data: { projects } }
export function getAllProjects() {
  return apiRequest("GET", "/projects");
}

// Réponse: { success, message, data: { project } }
export async function getProject(projectId) {
  return apiRequest("GET", `/projects/${projectId}`);
}

// Réponse: { success, message, data: { project } }
export function updateProject(projectId, projectData) {
  return apiRequest("PUT", `/projects/${projectId}`, projectData);
}

// Réponse: { success, message } - pas de data
export function deleteProject(projectId) {
  return apiRequest("DELETE", `/projects/${projectId}`);
}

// projectController.ts attend { email, role } - PAS "userId"
// Réponse: { success, message } - pas de data
export function addContributor(projectId, { email, role = "CONTRIBUTOR" }) {
  return apiRequest("POST", `/projects/${projectId}/contributors`, { email, role });
}

// Réponse: { success, message } - pas de data
export function removeContributor(projectId, userId) {
  return apiRequest("DELETE", `/projects/${projectId}/contributors/${userId}`);
}
