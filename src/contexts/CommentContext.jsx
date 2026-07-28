'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import {
  getAllCommentsAction,
  createCommentAction,
  updateCommentAction,
  deleteCommentAction,
} from '@/actions/commentActions';

const CommentContext = createContext(null);

/**
 * @param {object} props
 * @param {string|number} props.projectId
 * @param {string|number} props.taskId
 * @param {Array} props.initialComments - passé par le Server Component parent (getAllCommentsAction)
 * @param {React.ReactNode} props.children
 */
export function CommentProvider({ projectId, taskId, initialComments = [], children }) {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllCommentsAction(projectId, taskId);
      setComments(data.comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, taskId]);

  const addComment = async (commentData) => {
    const { data } = await createCommentAction(projectId, taskId, commentData);
    setComments((prev) => [...prev, data.comment]);
    return data.comment;
  };

  const editComment = async (commentId, commentData) => {
    const { data } = await updateCommentAction(projectId, taskId, commentId, commentData);
    setComments((prev) => prev.map((c) => (c.id === commentId ? data.comment : c)));
    return data.comment;
  };

  const removeComment = async (commentId) => {
    await deleteCommentAction(projectId, taskId, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <CommentContext.Provider
      value={{ comments, loading, error, refreshComments, addComment, editComment, removeComment }}
    >
      {children}
    </CommentContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComments doit être utilisé à l\'intérieur d\'un CommentProvider');
  }
  return context;
}
