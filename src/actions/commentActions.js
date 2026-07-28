'use server';

import {
  getAllComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} from '@/api';

export async function getAllCommentsAction(projectId, taskId) {
  return getAllComments(projectId, taskId);
}

export async function getCommentAction(projectId, taskId, commentId) {
  return getComment(projectId, taskId, commentId);
}

export async function createCommentAction(projectId, taskId, commentData) {
  return createComment(projectId, taskId, commentData);
}

export async function updateCommentAction(projectId, taskId, commentId, commentData) {
  return updateComment(projectId, taskId, commentId, commentData);
}

export async function deleteCommentAction(projectId, taskId, commentId) {
  return deleteComment(projectId, taskId, commentId);
}
