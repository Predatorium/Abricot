import { apiRequest } from "@/api/client"

export function createTask(projectId, taskData) {
  return apiRequest("POST", `/projects/${projectId}/tasks`, taskData);
}
 
export function getAllTasks(projectId) {
  return apiRequest("GET", `/projects/${projectId}/tasks`);
}
 
export function getTask(projectId, taskId) {
  return apiRequest("GET", `/projects/${projectId}/tasks/${taskId}`);
}
 
export function updateTask(projectId, taskId, taskData) {
  return apiRequest("PUT", `/projects/${projectId}/tasks/${taskId}`, taskData);
}
 
export function deleteTask(projectId, taskId) {
  return apiRequest("DELETE", `/projects/${projectId}/tasks/${taskId}`);
}