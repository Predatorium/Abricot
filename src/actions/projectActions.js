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

// Server Action qui récupère tous les projets, puis les enrichit
// avec le nombre total de tâches et le nombre de tâches terminées
export async function getAllProjectsAction() {
  // Récupération de la liste brute des projets
  const result = await getAllProjects();
  const projects = result.data.projects;

  // Pour chaque projet, on va chercher ses tâches en parallèle (Promise.all)
  // plutôt qu'en séquentiel, pour ne pas attendre un appel après l'autre
  const enrichedProjects = await Promise.all(
    projects.map(async (project) => {
      // Récupération des tâches associées à ce projet
      const tasksResult = await getAllTasks(project.id);
      const tasks = tasksResult.data.tasks;

      // Calcul du nombre total de tâches...
      const tasksTotal = tasks.length;
      // ...et du nombre de tâches terminées (statut "DONE")
      // → utile pour afficher une barre de progression côté UI (ex: CardProject)
      const tasksDone = tasks.filter((t) => t.status === 'DONE').length;

      // On renvoie le projet enrichi avec ces deux compteurs en plus
      return { ...project, tasksTotal, tasksDone };
    })
  );

  // On renvoie la liste enrichie dans le même format que l'API d'origine
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
