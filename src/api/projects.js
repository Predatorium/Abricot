import { apiRequest } from "@/api/client"

export function createProject(projectData) {
  return apiRequest("POST", "/projects", projectData);
}
 
export function getAllProjects() {
  return apiRequest("GET", "/projects");
}
 
export function getProject(projectId) {
  return apiRequest("GET", `/projects/${projectId}`);
}
 
export function updateProject(projectId, projectData) {
  return apiRequest("PUT", `/projects/${projectId}`, projectData);
}
 
export function deleteProject(projectId) {
  return apiRequest("DELETE", `/projects/${projectId}`);
}
 
export function addContributor(projectId, { userId }) {
  return apiRequest("POST", `/projects/${projectId}/contributors`, { userId });
}
 
export function removeContributor(projectId, userId) {
  return apiRequest("DELETE", `/projects/${projectId}/contributors/${userId}`);
}