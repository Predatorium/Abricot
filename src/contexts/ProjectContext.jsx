'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import {
  getAllProjectsAction,
  getProjectAction,
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  addContributorAction,
  removeContributorAction,
} from '@/actions/projectActions';

const ProjectContext = createContext(null);

/**
 * @param {object} props
 * @param {Array} props.initialProjects - passé par le Server Component parent (déjà résolu via getAllProjectsAction)
 * @param {React.ReactNode} props.children
 */
export function ProjectProvider({ initialProjects = [], children }) {
  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllProjectsAction();
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = async (projectData) => {
    const { data } = await createProjectAction(projectData);
    setProjects((prev) => [...prev, data.project]);
    return data.project;
  };

  const editProject = async (projectId, projectData) => {
    const { data } = await updateProjectAction(projectId, projectData);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? data.project : p)));
    return data.project;
  };

  const removeProject = async (projectId) => {
    await deleteProjectAction(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  // addContributor/removeContributor ne renvoient pas le projet mis à jour (juste un message),
  // donc on recharge le projet concerné pour resynchroniser sa liste de membres.
  const inviteContributor = async (projectId, { email, role = 'CONTRIBUTOR' }) => {
    await addContributorAction(projectId, { email, role });
    const { data } = await getProjectAction(projectId);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? data.project : p)));
    return data.project;
  };

  const evictContributor = async (projectId, userId) => {
    await removeContributorAction(projectId, userId);
    const { data } = await getProjectAction(projectId);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? data.project : p)));
    return data.project;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        refreshProjects,
        addProject,
        editProject,
        removeProject,
        inviteContributor,
        evictContributor,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects doit être utilisé à l\'intérieur d\'un ProjectProvider');
  }
  return context;
}
