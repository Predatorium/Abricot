'use server';

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
  return updateProject(projectId, projectData);
}

export async function deleteProjectAction(projectId) {
  return deleteProject(projectId);
}

export async function addContributorAction(projectId, payload) {
  return addContributor(projectId, payload);
}

export async function removeContributorAction(projectId, userId) {
  return removeContributor(projectId, userId);
}
