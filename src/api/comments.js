import { apiRequest } from "@/api/client"

export function createComment(projectId, taskId, commentData) {
  return apiRequest(
    "POST",
    `/projects/${projectId}/tasks/${taskId}/comments`,
    commentData
  );
}
 
export function getAllComments(projectId, taskId) {
  return apiRequest("GET", `/projects/${projectId}/tasks/${taskId}/comments`);
}
 
export function getComment(projectId, taskId, commentId) {
  return apiRequest(
    "GET",
    `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
  );
}
 
export function updateComment(projectId, taskId, commentId, commentData) {
  return apiRequest(
    "PUT",
    `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    commentData
  );
}
 
export function deleteComment(projectId, taskId, commentId) {
  return apiRequest(
    "DELETE",
    `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
  );
}