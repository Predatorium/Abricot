'use server';

import { revalidatePath } from 'next/cache';
import {
  getAllProjects,
  getAllTasks,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addContributor,
  removeContributor,
} from '@/api';

export async function getAllProjectsAction() {
  const result = await getAllProjects();
  const projects = result.data.projects;

  const enrichedProjects = await Promise.all(
    projects.map(async (project) => {
      const tasksResult = await getAllTasks(project.id);
      const tasks = tasksResult.data.tasks;
      const tasksTotal = tasks.length;
      const tasksDone = tasks.filter((t) => t.status === 'DONE').length;
      return { ...project, tasksTotal, tasksDone };
    })
  );

  return { data: { projects: enrichedProjects } };
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
