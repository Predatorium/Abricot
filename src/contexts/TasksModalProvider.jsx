'use client';

import { TaskModalProvider } from '@/contexts/TaskModalContext';
import { TaskModalIAProvider } from '@/contexts/TaskModalIAContext';

/**
 * Regroupe les contexts globaux (Auth + Projects). Les données initiales viennent
 * du Server Component parent (ProtectedLayout) - plus de fetch au montage ici.
 * TaskContext/CommentContext restent montés plus bas (page projet/tâche), avec le
 * même principe : initialTasks/initialComments passés par leur propre layout serveur.
 */
export default function TasksModalProvider({ children }) {
  return (
    <TaskModalProvider >
      <TaskModalIAProvider >{children}</TaskModalIAProvider>
    </TaskModalProvider>
  );
}