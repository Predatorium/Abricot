'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const ProjectModalContext = createContext(null);

export function ProjectModalProvider({ children }) {
  const [state, setState] = useState({ isOpen: false, mode: null, project: null });

  const openCreateModal = useCallback(() => {
    setState({ isOpen: true, mode: 'create', project: null });
  }, []);

  const openEditModal = useCallback((project) => {
    setState({ isOpen: true, mode: 'edit', project });
  }, []);

  const closeModal = useCallback(() => {
    setState({ isOpen: false, mode: null, project: null });
  }, []);

  return (
    <ProjectModalContext.Provider value={{ ...state, openCreateModal, openEditModal, closeModal }}>
      {children}
    </ProjectModalContext.Provider>
  );
}

export function useProjectModal() {
  const context = useContext(ProjectModalContext);
  if (!context) throw new Error('useProjectModal doit être utilisé dans un ProjectModalProvider');
  return context;
}