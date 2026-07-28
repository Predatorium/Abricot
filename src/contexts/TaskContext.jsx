'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import {
  getAllTasksAction,
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from '@/actions/taskActions';

const TaskContext = createContext(null);

/**
 * @param {object} props
 * @param {string|number} props.projectId
 * @param {Array} props.initialTasks - passé par le Server Component parent (getAllTasksAction)
 * @param {React.ReactNode} props.children
 */
export function TaskProvider({ projectId, initialTasks = [], children }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllTasksAction(projectId);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const addTask = async (taskData) => {
    const { data } = await createTaskAction(projectId, taskData);
    setTasks((prev) => [...prev, data.task]);
    return data.task;
  };

  const editTask = async (taskId, taskData) => {
    const { data } = await updateTaskAction(projectId, taskId, taskData);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
    return data.task;
  };

  const removeTask = async (taskId) => {
    await deleteTaskAction(projectId, taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, error, refreshTasks, addTask, editTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks doit être utilisé à l\'intérieur d\'un TaskProvider');
  }
  return context;
}
