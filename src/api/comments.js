import { apiRequest } from "@/api/client"

// Réponse: { success, message, data: { comment } }
export function createComment(projectId, taskId, commentData) {
  return apiRequest(
    "POST",
    `/projects/${projectId}/tasks/${taskId}/comments`,
    commentData
  );
}

// Réponse: { success, message, data: { comments } }
export function getAllComments(projectId, taskId) {
  return apiRequest("GET", `/projects/${projectId}/tasks/${taskId}/comments`);
}

// Réponse: { success, message, data: { comment } }
export function getComment(projectId, taskId, commentId) {
  return apiRequest(
    "GET",
    `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
  );
}

// Réponse: { success, message, data: { comment } }
export function updateComment(projectId, taskId, commentId, commentData) {
  return apiRequest(
    "PUT",
    `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    commentData
  );
}

// Réponse: { success, message } - pas de data
export function deleteComment(projectId, taskId, commentId) {
  return apiRequest(
    "DELETE",
    `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
  );
}
