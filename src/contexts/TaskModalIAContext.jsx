'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const TaskModalIAContext = createContext(null);

export function TaskModalIAProvider({ children }) {
  const [state, setState] = useState({ isOpen: false});

  const openCreateModalIA = useCallback(() => {
    setState({ isOpen: true});
  }, []);

  const closeModalIA = useCallback(() => {
    setState({ isOpen: false});
  }, []);

  return (
    <TaskModalIAContext.Provider value={{ ...state, openCreateModalIA, closeModalIA }}>
      {children}
    </TaskModalIAContext.Provider>
  );
}

export function useTaskModalIA() {
  const context = useContext(TaskModalIAContext);
  if (!context) throw new Error('useTaskIAModal doit être utilisé dans un TaskModalIAContext');
  return context;
}