'use server';

import { revalidatePath } from 'next/cache';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addContributor,
  removeContributor,
} from '@/api';

export async function getAllProjectsAction() {
  return getAllProjects();
}

export async function getProjectAction(projectId) {
  return getProject(projectId);
}

export async function createProjectAction(projectData) {
  return createProject(projectData);
}

export async function updateProjectAction(projectId, projectData) {
  const result = await updateProject(projectId, projectData);
  revalidatePath(`/projects/${projectId}`);
  return result;
}

export async function deleteProjectAction(projectId) {
  return deleteProject(projectId);
}

export async function addContributorAction(projectId, payload) {
  const result = await addContributor(projectId, payload);
  revalidatePath(`/projects/${projectId}`);
  return result;
}

export async function removeContributorAction(projectId, userId) {
  const result = await removeContributor(projectId, userId);
  revalidatePath(`/projects/${projectId}`);
  return result;
}
