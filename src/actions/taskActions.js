'use server';

import { getAllTasks, getTask, createTask, updateTask, deleteTask } from '@/api';

export async function getAllTasksAction(projectId) {
  return getAllTasks(projectId);
}

export async function getTaskAction(projectId, taskId) {
  return getTask(projectId, taskId);
}

export async function createTaskAction(projectId, taskData) {
  return createTask(projectId, taskData);
}

export async function updateTaskAction(projectId, taskId, taskData) {
  return updateTask(projectId, taskId, taskData);
}

export async function deleteTaskAction(projectId, taskId) {
  return deleteTask(projectId, taskId);
}
