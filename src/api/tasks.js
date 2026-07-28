import { apiRequest } from "@/api/client"

// Réponse: { success, message, data: { task } }
export function createTask(projectId, taskData) {
  return apiRequest("POST", `/projects/${projectId}/tasks`, taskData);
}

// Réponse: { success, message, data: { tasks } }
export function getAllTasks(projectId) {
  return apiRequest("GET", `/projects/${projectId}/tasks`);
}

// Réponse: { success, message, data: { task } }
export function getTask(projectId, taskId) {
  return apiRequest("GET", `/projects/${projectId}/tasks/${taskId}`);
}

// Réponse: { success, message, data: { task } }
export function updateTask(projectId, taskId, taskData) {
  return apiRequest("PUT", `/projects/${projectId}/tasks/${taskId}`, taskData);
}

// Réponse: { success, message } - pas de data
export function deleteTask(projectId, taskId) {
  return apiRequest("DELETE", `/projects/${projectId}/tasks/${taskId}`);
}
