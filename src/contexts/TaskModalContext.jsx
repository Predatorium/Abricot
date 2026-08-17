'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const TaskModalContext = createContext(null);

export function TaskModalProvider({ children }) {
  const [state, setState] = useState({ isOpen: false, mode: null, task: null, project: null });

  const openCreateModal = useCallback((project) => {
    setState({ isOpen: true, mode: 'create', task: null, project });
  }, []);

  const openEditModal = useCallback((task, project) => {
    setState({ isOpen: true, mode: 'edit', task: task, project: project });
  }, []);

  const closeModal = useCallback(() => {
    setState({ isOpen: false, mode: null, task: null, project: null });
  }, []);

  return (
    <TaskModalContext.Provider value={{ ...state, openCreateModal, openEditModal, closeModal }}>
      {children}
    </TaskModalContext.Provider>
  );
}

export function useTaskModal() {
  const context = useContext(TaskModalContext);
  if (!context) throw new Error('useTaskModal doit être utilisé dans un TaskModalProvider');
  return context;
}