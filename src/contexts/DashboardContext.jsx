'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getAssignedTasksAction,
  getProjectsWithTasksAction,
} from '@/actions/dashboardActions';

const DashboardContext = createContext(null);

/**
 * @param {object} props
 * @param {Array} [props.initialAssignedTasks]
 * @param {Array} [props.initialProjectsWithTasks]
 * @param {React.ReactNode} props.children
 */
export function DashboardProvider({
  initialAssignedTasks = [],
  initialProjectsWithTasks = [],
  children,
}) {
  const [assignedTasks, setAssignedTasks] = useState(initialAssignedTasks);
  const [projectsWithTasks, setProjectsWithTasks] = useState(initialProjectsWithTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshAssignedTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAssignedTasksAction();
      setAssignedTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProjectsWithTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getProjectsWithTasksAction();
      setProjectsWithTasks(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial automatique au montage - une seule fonction, un seul setLoading,
  // les deux requêtes partent en parallèle
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      setError(null);
      try {
        const [tasksResult, projectsResult] = await Promise.all([
          getAssignedTasksAction(),
          getProjectsWithTasksAction(),
        ]);
        setAssignedTasks(tasksResult.data.tasks);
        setProjectsWithTasks(projectsResult.data.projects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        assignedTasks,
        projectsWithTasks,
        loading,
        error,
        refreshAssignedTasks,
        refreshProjectsWithTasks,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard doit être utilisé à l\'intérieur d\'un DashboardProvider');
  }
  return context;
}